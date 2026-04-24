import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateLogos } from './providers/index.js';
import { svgFromPng, placeholderSvg } from './utils/svg.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', provider: process.env.AI_PROVIDER || 'mock' });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { brandName, style, colors, count } = req.body || {};
    if (!brandName || !String(brandName).trim()) {
      return res.status(400).json({ error: 'brandName is required' });
    }
    const n = Math.min(Math.max(parseInt(count) || 4, 1), 4);
    const logos = await generateLogos({
      brandName: String(brandName).trim(),
      style: style ? String(style) : 'minimaliste',
      colors: Array.isArray(colors) ? colors.slice(0, 5) : [],
      count: n,
    });
    res.json({ logos });
  } catch (err) {
    console.error('[/api/generate] error:', err);
    res.status(500).json({ error: err.message || 'Generation failed' });
  }
});

// Convert a generated PNG (base64 dataURL) to a downloadable SVG wrapper.
// For real vectorization you'd integrate potrace; here we embed the PNG inside an SVG.
app.post('/api/to-svg', async (req, res) => {
  try {
    const { dataUrl, brandName } = req.body || {};
    if (!dataUrl) return res.status(400).json({ error: 'dataUrl is required' });
    const svg = svgFromPng(dataUrl, brandName || 'logo');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (err) {
    console.error('[/api/to-svg] error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/placeholder-svg', (req, res) => {
  const { text = 'Logo', color = '#6366f1' } = req.query;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(placeholderSvg(String(text), String(color)));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ AI Logo backend running on http://localhost:${PORT}`);
  console.log(`  Provider: ${process.env.AI_PROVIDER || 'mock'}`);
});
