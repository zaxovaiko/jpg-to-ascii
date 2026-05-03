# JPG to ASCII

Converts JPG picture into ASCII symbols. Built with TypeScript.

![Screenshot](https://imgur.com/1rKeWS4.png)
![Screenshot](https://imgur.com/MWO7O3Q.png)

## How to run

- Clone: `git clone https://github.com/zaxoavoki/jpg-to-ascii.git`
- Install: `pnpm install`
- Build and start: `pnpm build && pnpm start`
- Dev mode (watch): `pnpm dev`

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm start` | Run server |
| `pnpm dev` | Webpack watch + server watch |
| `pnpm build` | Bundle client assets |
| `pnpm lint` | Lint with oxlint |
| `pnpm format` | Format with oxfmt |

## About

### Mapping image data

Uses `jpeg-js` to read image data. Each pixel is converted to grayscale using the [CIE 1931](https://en.wikipedia.org/wiki/CIE_1931_color_space) linear luminance formula:

Y<sub>lin</sub> = 0.2126 *R<sub>lin</sub> + 0.7152* G<sub>lin</sub> + 0.0722 * B<sub>lin</sub>

Each grayscale value is then mapped to the nearest ASCII character in `ascii_map.json`.

### Resizing

Removes every second row or column to shrink the image. Number of squeezes determined by `2^x = width / 170px`.

## To-do

- [ ] Add extended ASCII map
- [ ] Add support for other image formats
