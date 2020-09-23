const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app){
    app.use('/api/python', createProxyMiddleware({ target: 'http://127.0.0.1:5000', changeOrigin: true }));
    app.use('/api', createProxyMiddleware({ target: 'http://127.0.0.1:4000', changeOrigin: true }));   
}