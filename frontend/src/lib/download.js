export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadAsPng(dataUrl, filename) {
  // If it's already PNG, just save it directly.
  if (dataUrl.startsWith('data:image/png')) {
    const blob = await (await fetch(dataUrl)).blob();
    return downloadBlob(blob, filename);
  }
  // Otherwise (SVG), rasterize via canvas.
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = dataUrl;
  });
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, 0, 0, size, size);
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
  downloadBlob(blob, filename);
}

export function downloadAsSvg(svgOrDataUrl, filename) {
  let svg;
  if (svgOrDataUrl.startsWith('data:image/svg+xml')) {
    const comma = svgOrDataUrl.indexOf(',');
    const payload = svgOrDataUrl.slice(comma + 1);
    svg = svgOrDataUrl.includes(';base64')
      ? atob(payload)
      : decodeURIComponent(payload);
  } else {
    svg = svgOrDataUrl;
  }
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, filename);
}

export function slugify(s) {
  return String(s || 'logo')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'logo';
}
