export async function generateWithStability({ prompt, count = 4 }) {
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
