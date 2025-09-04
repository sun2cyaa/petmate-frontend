const { cteateProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/member', 
        cteateProxyMiddleware({          
            target: 'http://localhost:8090',    
            changerOrigin: true,
        })
    );
};