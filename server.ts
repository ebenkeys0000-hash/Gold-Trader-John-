import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/api';
import { renderConfigStatusHtml } from './server/configStatusPage';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for secure cookies behind reverse proxy
  app.set('trust proxy', 1);

  // JSON Body Parser with size limits
  app.use(express.json({ limit: '5mb' }));

  // Cookie parser for HttpOnly session authentication
  app.use(cookieParser());

  // API Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Server-Side Configuration Status Page (No secrets exposed)
  app.get('/config-status', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderConfigStatusHtml());
  });

  // Mount API router
  app.use('/api', apiRouter);

  // Vite middleware for development / Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gold Trader John Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
