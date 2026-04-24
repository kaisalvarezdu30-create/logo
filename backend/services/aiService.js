import { mockLogoSvg } from '../utils/svg.js';

/**
 * Main entry: generates `count` logos using the configured AI provider.
 * Falls back to mock SVG generation if no provider / API key is configured
 * or if the remote call fails.
 */
export async function generateLogos(params) {
  const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();
  const prompt = buildPrompt(params);

  try {
    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      return await generateWithOpenAI({ ...params, prompt });
    }
    if (provider === 'stability' && process.env.STABILITY_API_KEY) {
      return await generateWithStability({ ...params, prompt });
    }
  } catch (err) {
    console.warn(`[aiService:${provider}] failed, falling back to mock:`, err.message);
  }
  return generateMock({ ...params, prompt });
}

function buildPrompt({ brandName, style, colors }) {
  const palette = (colors && colors.length)
    ? `Use this color palette: ${colors.join(', ')}.`
    : 'Use a tasteful, modern color palette.';
  return [
    `Professional vector logo for the brand "${brandName}".`,
    `Style: ${style}.`,
    palette,
    'Clean, iconic, memorable, scalable, centered on a plain white background.',
    'No photo-realistic elements, no text artifacts, flat design, high contrast.',
  ].join(' ');
}

/* ------------------------- OpenAI (DALL·E / gpt-image-1) ------------------------- */
async function generateWithOpenAI({ prompt, count = 4 }) {
  const model = process.env.OPENAI_MODEL || 'gpt-image-1';
  const isDalle3 = model.includes('dall-e-3');
  const results = [];
  const batches = isDalle3 ? Array.from({ length: count }) : [null];

  for (const _ of batches) {
    const body = {
      model,
      prompt,
      size: '1024x1024',
      n: isDalle3 ? 1 : count,
    };
    const resp = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`OpenAI error ${resp.status}: ${text}`);
    }
    const data = await resp.json();
    for (const item of data.data || []) {
      const dataUrl = item.b64_json
        ? `data:image/png;base64,${item.b64_json}`
        : item.url;
      results.push({ dataUrl, provider: 'openai' });
    }
  }
  return results.slice(0, count);
}

/* ----------------------------- Stability AI ----------------------------- */
async function generateWithStability({ prompt, count = 4 }) {
  const results = [];
  for (let i = 0; i < count; i++) {
    const form = new FormData();
    form.append('prompt', prompt);
    form.append('output_format', 'png');
    form.append('aspect_ratio', '1:1');

    const resp = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        Accept: 'image/*',
      },
      body: form,
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Stability error ${resp.status}: ${text}`);
    }
    const buf = Buffer.from(await resp.arrayBuffer());
    const dataUrl = `data:image/png;base64,${buf.toString('base64')}`;
    results.push({ dataUrl, provider: 'stability' });
  }
  return results;
}

/* ------------------------------- Mock ---------------------------------- */
function generateMock({ brandName, style, colors, count = 4 }) {
  const palette = colors && colors.length
    ? colors
    : ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];
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
