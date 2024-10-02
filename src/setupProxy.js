// https://create-react-app.dev/docs/proxying-api-requests-in-development/
let createProxyMiddleware
;({ createProxyMiddleware } = require('http-proxy-middleware'))

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
      changeOrigin: true,
    })
  )
}
