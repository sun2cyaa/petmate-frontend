// const { cteateProxyMiddleware } = require('http-proxy-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        // '/member', 
        '/api', 
        // cteateProxyMiddleware({          
        createProxyMiddleware({          
            target: 'http://localhost:8090',    
            // changerOrigin: true,
            changeOrigin: true,
        })
    );
};