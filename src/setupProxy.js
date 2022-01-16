const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:2000/",
      changeOrigin: true,
    })
  );
  app.use(
    "/plan",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin:true,
    })
  );
  app.use(
    "/session",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin:true,
    })
  );
};