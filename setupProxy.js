// const { cteateProxyMiddleware } = require('http-proxy-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        // '/member',
        '/api',
        // cteateProxyMiddleware({
        createProxyMiddleware({
            target: process.env.REACT_APP_SPRING_API_BASE || 'http://localhost:8090',
            // changerOrigin: true,
            changeOrigin: true,
        })
    );
};