import { generateWithOpenAI } from './openai.js';
import { generateWithStability } from './stability.js';
import { generateMock } from './mock.js';

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
    console.warn(`[provider:${provider}] failed, falling back to mock:`, err.message);
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
