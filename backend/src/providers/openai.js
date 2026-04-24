export async function generateWithOpenAI({ prompt, count = 4 }) {
  const model = process.env.OPENAI_MODEL || 'gpt-image-1';
  const results = [];

  // gpt-image-1 supports n up to 10; dall-e-3 requires n=1.
  const isDalle3 = model.includes('dall-e-3');
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
