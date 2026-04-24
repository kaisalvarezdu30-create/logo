// Embed a PNG dataURL into an SVG so users can download a vector-wrapped file.
export function svgFromPng(dataUrl, brandName) {
  const safe = escapeXml(brandName);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" width="1024" height="1024">
  <title>${safe}</title>
  <image href="${dataUrl}" x="0" y="0" width="1024" height="1024"/>
</svg>`;
}

export function placeholderSvg(text, color) {
  const safe = escapeXml(text);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#ffffff"/>
  <circle cx="256" cy="220" r="120" fill="${color}"/>
  <text x="50%" y="420" font-family="Inter, Arial, sans-serif" font-size="56" font-weight="700" text-anchor="middle" fill="#111827">${safe}</text>
</svg>`;
}

export function mockLogoSvg({ brandName, style, color, variant }) {
  const initials = getInitials(brandName);
  const darker = shade(color, -30);
  const lighter = shade(color, 30);
  const safeBrand = escapeXml(brandName);
  const safeStyle = escapeXml(style || '');

  const shapes = {
    circle: `
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${lighter}"/>
          <stop offset="100%" stop-color="${darker}"/>
        </linearGradient>
      </defs>
      <circle cx="256" cy="220" r="130" fill="url(#g)"/>
      <text x="256" y="250" font-family="Inter, Arial, sans-serif" font-size="110" font-weight="800" text-anchor="middle" fill="#ffffff">${escapeXml(initials)}</text>
    `,
    hexagon: `
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${lighter}"/>
          <stop offset="100%" stop-color="${darker}"/>
        </linearGradient>
      </defs>
      <polygon points="256,90 376,160 376,300 256,370 136,300 136,160" fill="url(#g)"/>
      <text x="256" y="255" font-family="Inter, Arial, sans-serif" font-size="100" font-weight="800" text-anchor="middle" fill="#ffffff">${escapeXml(initials)}</text>
    `,
    wave: `
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="${lighter}"/>
        </linearGradient>
      </defs>
      <path d="M80,260 C160,160 240,360 320,260 S480,160 440,260 L440,340 L80,340 Z" fill="url(#g)"/>
      <circle cx="256" cy="180" r="56" fill="${darker}"/>
    `,
    monogram: `
      <rect x="106" y="90" width="300" height="280" rx="40" fill="none" stroke="${color}" stroke-width="14"/>
      <text x="256" y="275" font-family="Georgia, serif" font-size="150" font-weight="700" text-anchor="middle" fill="${darker}">${escapeXml(initials)}</text>
    `,
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#ffffff"/>
  ${shapes[variant] || shapes.circle}
  <text x="256" y="430" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="700" text-anchor="middle" fill="#111827" letter-spacing="2">${safeBrand.toUpperCase()}</text>
  <text x="256" y="462" font-family="Inter, Arial, sans-serif" font-size="16" text-anchor="middle" fill="#6b7280" letter-spacing="4">${safeStyle.toUpperCase()}</text>
</svg>`;
}

function getInitials(name) {
  if (!name) return 'L';
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function escapeXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function shade(hex, percent) {
  const h = hex.replace('#', '');
  const num = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  let r = (num >> 16) + Math.round((percent / 100) * 255);
  let g = ((num >> 8) & 0xff) + Math.round((percent / 100) * 255);
  let b = (num & 0xff) + Math.round((percent / 100) * 255);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
