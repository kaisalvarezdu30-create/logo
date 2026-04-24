import { generateLogos } from '../services/aiService.js';
import { svgFromPng, placeholderSvg } from '../utils/svg.js';

export async function generateLogoHandler(req, res, next) {
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
    next(err);
  }
}

export async function toSvgHandler(req, res, next) {
  try {
    const { dataUrl, brandName } = req.body || {};
    if (!dataUrl) return res.status(400).json({ error: 'dataUrl is required' });
    const svg = svgFromPng(dataUrl, brandName || 'logo');
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (err) {
    next(err);
  }
}

export function placeholderSvgHandler(req, res) {
  const { text = 'Logo', color = '#6366f1' } = req.query;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(placeholderSvg(String(text), String(color)));
}
