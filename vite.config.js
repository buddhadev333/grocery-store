import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import loginHandler from './api/auth/login.js';
import verifyHandler from './api/auth/verify.js';
import updatePriceHandler from './api/products/update-price.js';
import manageProductHandler from './api/products/manage.js';

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        // Buffer and parse JSON request body
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const rawBody = Buffer.concat(chunks).toString();
        let body = {};
        try {
          if (rawBody) body = JSON.parse(rawBody);
        } catch (e) {
          body = {};
        }

        req.body = body;

        // Vercel-compatible res helpers
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = parsedUrl.pathname;

        try {
          if (pathname === '/api/auth/login') {
            return await loginHandler(req, res);
          }
          if (pathname === '/api/auth/verify') {
            return await verifyHandler(req, res);
          }
          if (pathname === '/api/products/update-price') {
            return await updatePriceHandler(req, res);
          }
          if (pathname === '/api/products/manage') {
            return await manageProductHandler(req, res);
          }

          return res.status(404).json({ error: `API route ${pathname} not found.` });
        } catch (err) {
          console.error('API Error:', err);
          return res.status(500).json({ error: 'Internal API error', details: err.message });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiDevServerPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
