import app from '../server/index.js';

export default function handler(req, res) {
  // If Vercel rewrites stripped the '/api' prefix, prepend it so Express routes match accurately:
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}
