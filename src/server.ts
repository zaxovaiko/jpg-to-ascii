import path from 'path';
import multer from 'multer';
import express from 'express';
import convert from './convert';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

const app = express();

app.use('/', express.static(path.join(__dirname, '../public')));
app.post('/convert', upload.single('image'), async (req, res) => {
  if (!req.file) return res.json({ error: 'An image is required.' });
  if (req.file.mimetype !== 'image/jpeg') return res.json({ error: 'Choose an image in jpg format.' });
  res.json(await convert(req.file.buffer, req.body.compression));
});

export default app;

if (require.main === module) {
  const port = process.env.PORT ?? 80;
  app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));
}
