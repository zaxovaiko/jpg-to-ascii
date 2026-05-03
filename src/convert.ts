import sharp from 'sharp';
import map from './ascii_map.json';

type ConvertResult = { data: string } | { error: string };

const asciiMap = map as Record<string, string>;
const mapKeys = Object.keys(asciiMap).map(parseFloat).sort((a, b) => a - b);

function encode(code: number): string {
  const diffs = mapKeys.map(k => Math.abs(k - code));
  return asciiMap[mapKeys[diffs.indexOf(Math.min(...diffs))].toString()];
}

export default async function convert(buffer: Buffer, compression: string): Promise<ConvertResult> {
  try {
    const meta = await sharp(buffer).metadata();
    if (!meta.width) throw new Error('unreadable dimensions');

    const targetWidth = compression === 'random'
      ? Math.ceil(meta.width / Math.pow(2, Math.ceil(Math.random() * 4)))
      : (parseInt(compression, 10) || 170);

    const { data, info } = await sharp(buffer)
      .flatten()
      .toColorspace('srgb')
      .resize({ width: targetWidth, withoutEnlargement: true })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, channels } = info;
    const pixelCount = data.length / channels;
    const pixels = Array.from(
      { length: pixelCount },
      (_, i) => 0.2126 * data[i * channels] + 0.7152 * data[i * channels + 1] + 0.0722 * data[i * channels + 2]
    );

    return {
      data: pixels.reduce(
        (acc, cur, ind) => acc + encode(cur) + ((ind + 1) % width === 0 ? '\n' : ''),
        ''
      ),
    };
  } catch {
    return { error: 'Something went wrong.' };
  }
}
