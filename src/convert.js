const fs = require("fs");
const path = require("path");
const jpeg = require("jpeg-js");
const map = require("./ascii_map.json");

module.exports = function (req) {
	// Remove file to save space
	const removeFile = filepath => {
		try {
			fs.unlinkSync(filepath);
		} catch (err) {
			return {
				error: "Something went wrong."
			};
		}
	};

	const file = req.file;
	const filepath = path.join(
		__dirname,
		`../${file.destination}${file.filename}`
	);

	// Check for valid format
	if (!file || file.mimetype !== "image/jpeg") {
		removeFile(filepath);
		return {
			error: "Choose an image in jpg format."
		};
	}

	const jpegData = fs.readFileSync(filepath);
	const rawImageData = jpeg.decode(jpegData, {
		useTArray: true,
		formatAsRGBA: true
	});

	removeFile(filepath);
	let data = [];
	let width = rawImageData.width;

	// Prevent memory load
	if (rawImageData.width * rawImageData.height >= 1200000) {
		return {
			error: "Image is too big."
		};
	}

	for (let i = 0; i < rawImageData.data.length - 4; i += 4) {
		// data.push(rawImageData.data.slice(i, i + 4));
		data.push([
			rawImageData.data[i],
			rawImageData.data[i + 1],
			rawImageData.data[i + 2],
			rawImageData.data[i + 3]
		]);
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

	// Resize image by removing each second row or column
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

	// If client checked compression
	if (req.body.rand === "true") {
		resize(Math.ceil(Math.random() * 4));
	} else {
		// Find how many times we can squeeze image
		resize(Math.ceil(Math.log2(width / 170)));
	}

	// Encode outcoming pixels to ascii symbols and then
	// make output text image
	return {
		data: data
			.map(e => encode(e))
			.reduce(
				(acc, cur, ind) =>
					(acc += cur + ((ind + 1) % width === 0 ? "\n" : "")),
				""
			)
	};
};
