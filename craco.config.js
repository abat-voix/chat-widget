const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  webpack: {
    plugins: {
      add: [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'extension'),
              to: path.resolve(__dirname, 'build'),
            },
          ],
        }),
      ],
    },
    configure: (webpackConfig) => {
      webpackConfig.optimization.splitChunks = {
        cacheGroups: {
          default: false,
        },
      }
      webpackConfig.optimization.runtimeChunk = false
      webpackConfig.output.filename = 'static/js/[name].js'
      webpackConfig.plugins[6].options.filename = 'static/css/[name].css'
      webpackConfig.plugins[6].options.moduleFilename = () =>
        'static/css/main.css'
      return webpackConfig
    },
  },
}
