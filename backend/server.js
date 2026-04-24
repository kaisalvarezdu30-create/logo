import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateLogoRouter from './routes/generateLogo.js';

dotenv.config();

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
