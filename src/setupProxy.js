import { createProxyMiddleware } from 'http-proxy-middleware';

const apiProxy = createProxyMiddleware('/auth/google', {
  target: 'http://localhost:3001',
  changeOrigin: true,
});

const callbackProxy = createProxyMiddleware('/auth/google/callback', {
  target: 'http://localhost:3001',
  changeOrigin: true,
});

module.exports = function (app) {
  app.use(apiProxy);
  app.use(callbackProxy);
};
