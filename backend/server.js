import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateLogoRouter from './routes/generateLogo.js';

dotenv.config();

// Validate AI provider configuration at startup
const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();
if (provider === 'openai' && !process.env.OPENAI_API_KEY) {
  console.warn('⚠  AI_PROVIDER=openai but OPENAI_API_KEY is missing → falling back to mock');
} else if (provider === 'stability' && !process.env.STABILITY_API_KEY) {
  console.warn('⚠  AI_PROVIDER=stability but STABILITY_API_KEY is missing → falling back to mock');
} else if (!['openai', 'stability', 'mock'].includes(provider)) {
  console.warn(`⚠  Unknown AI_PROVIDER="${provider}" → falling back to mock`);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', provider: process.env.AI_PROVIDER || 'mock' });
});

app.use('/api', generateLogoRouter);

app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ AI Logo backend running on http://localhost:${PORT}`);
  console.log(`  Provider: ${process.env.AI_PROVIDER || 'mock'}`);
});
