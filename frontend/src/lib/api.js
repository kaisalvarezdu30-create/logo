const BASE = '/api';

export async function generateLogos(payload) {
  const res = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function toSvg({ dataUrl, brandName }) {
  const res = await fetch(`${BASE}/to-svg`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl, brandName }),
  });
  if (!res.ok) throw new Error('SVG conversion failed');
  return res.text();
}
