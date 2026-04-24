import { mockLogoSvg } from '../utils/svg.js';

// Generates 4 unique SVG-based mock logos, returned as PNG-ish dataURLs (image/svg+xml).
// This lets the frontend work without any API key. The /api/to-svg endpoint still works
// for real PNGs coming from real providers.
export async function generateMock({ brandName, style, colors, count = 4 }) {
  const palette = colors && colors.length ? colors : ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];
  const variants = ['circle', 'hexagon', 'wave', 'monogram'];
  const out = [];
  for (let i = 0; i < count; i++) {
    const color = palette[i % palette.length];
    const variant = variants[i % variants.length];
    const svg = mockLogoSvg({ brandName, style, color, variant });
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    out.push({ dataUrl, provider: 'mock', svg, variant });
  }
  return out;
}
