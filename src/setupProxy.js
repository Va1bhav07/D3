const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/v2/competitions",
    createProxyMiddleware({
      target: "https://api.football-data.org",
      changeOrigin: true,
    })
  );
};
