const path = require("path");
const multer = require("multer");
const express = require("express");
const convert = require("./convert");

const upload = multer({ dest: "temp/" });
const app = express();

app.use("/", express.static(path.join(__dirname, "../public")));
app.post("/convert", upload.single("image"), async (req, res) => {
	try {
		res.json(await convert(req.file));
	} catch (err) {
		res.json("Something went wrong. Try again.");
	}
});

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Listening on port ${port}.`));
