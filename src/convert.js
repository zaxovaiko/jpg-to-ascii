const fs = require("fs");
const path = require("path");
const jpeg = require("jpeg-js");
const map = require("./ascii_map.json");

module.exports = function (file) {
	// TODO: check extention of image
	const filepath = path.join(
		__dirname,
		`../${file.destination}${file.filename}`
	);
	const jpegData = fs.readFileSync(filepath);
	const rawImageData = jpeg.decode(jpegData, {
		useTArray: true,
		formatAsRGBA: true
	});

	try {
		fs.unlinkSync(filepath);
	} catch (err) {
		return "Something went wrong.";
	}

	let data = [];
	let width = rawImageData.width;

	// Prevent error appearing
	if (rawImageData.width * rawImageData.height >= 7_000_000) {
		return "Image is too big.";
	}

	for (let i = 0; i < rawImageData.data.length; i += 4) {
		data.push(rawImageData.data.slice(i, i + 4));
	}

	// Linear luminance is calculated as a weighted sum of the three linear-intensity values RGB
	data = data.map(e => 0.2126 * e[0] + 0.7152 * e[1] + 0.0722 * e[2]);

	// Get keys from ascii map
	let keys = Object.keys(map).map(e => parseFloat(e));
	keys.sort((a, b) => a - b);

	// Grayscale to ascii char
	function encode(code) {
		let tmp = [...keys].map(e => Math.abs(e - code));
		return map[keys[tmp.indexOf(Math.min(...tmp))]];
	}

	function resize(times) {
		// Remove every second column
		function squeezeWidth(arr) {
			for (let i = 0; i < arr.length - 1; i += 2) {
				if (width % 2 !== 0 && (i + 1) % width === 0) {
					i--;
				} else {
					delete arr[i + 1];
				}
			}

			width = Math.ceil(width / 2);
			return arr.filter(e => !isNaN(e));
		}

		// Remove every second row
		function squeezeHeight(arr) {
			for (let i = 0; i < arr.length; i++) {
				if (i % width === 0 && i !== 0) {
					i += width;
				}
				delete arr[i + width];
			}
			return arr.filter(e => !isNaN(e));
		}

		data = squeezeHeight(data);
		for (let i = 0; i < times; i++) {
			data = squeezeHeight(squeezeWidth(data));
		}
	}

	// TODO: write algorithm for best image fitting
	resize(Math.ceil(Math.random() * 4));

	// Encode outcoming pixels to ascii symbols
	let encodedImg = data.map(e => encode(e));
	let out = "";

	// Make output text image
	// TODO: replace with reducer
	for (let i = 0; i < encodedImg.length; i++) {
		out += encodedImg[i];
		if ((i + 1) % width === 0) {
			out += "\n";
		}
	}

	return out;
};
