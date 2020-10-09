const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/gotenberg',
        createProxyMiddleware({
            target: 'http://localhost:3010',
            changeOrigin: true,
            pathRewrite: {'^/gotenberg': ''}
        })
    );
};