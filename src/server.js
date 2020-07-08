const path = require("path");
const multer = require("multer");
const express = require("express");
const convert = require("./convert");

const upload = multer({ dest: "temp/" });
const app = express();

app.use("/", express.static(path.join(__dirname, "../public")));
app.post("/convert", upload.single("image"), (req, res) => res.json(convert(req.file)));

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Listening on port ${port}.`));
