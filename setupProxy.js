// const { cteateProxyMiddleware } = require('http-proxy-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
<<<<<<< HEAD
        // '/member', 
        '/api', 
        // cteateProxyMiddleware({          
        createProxyMiddleware({          
            target: 'http://localhost:8090',    
=======
        // '/member',
        '/api',
        // cteateProxyMiddleware({
        createProxyMiddleware({
            target: process.env.REACT_APP_SPRING_API_BASE || 'http://localhost:8090',
>>>>>>> 3bea2ee84000cc559091f7f22ace329712527bc6
            // changerOrigin: true,
            changeOrigin: true,
        })
    );
};