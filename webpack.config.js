'use strict';
const webpack = require('webpack');

const useCSSSourceMaps = (process.env.CSS_SOURCEMAPS === 'true');

module.exports = {
  entry: {
    client: ['webpack-dev-server/client?http://localhost:8080'],
    index: ['./src/index.jsx', 'webpack/hot/only-dev-server'],
    component_library: ['webpack/hot/only-dev-server', './src/component_library.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel'
    },{
      test: /\.css$/,
      exclude: /node_modules/,
      loaders: [
        'style',
        // Enabling source maps for the css loader moves the style
        // definitions into object urls which means we cannot use relative
        // paths (see links below).
        // Because we need to use relative paths in the Electron app (we have
        // no server running) we have to disable source maps for it.
        // https://github.com/webpack/style-loader#recommended-configuration
        // https://github.com/webpack/style-loader/issues/55
        useCSSSourceMaps ? 'css?modules&sourceMap' : 'css?modules'
      ]
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: '[name].js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
     new webpack.ProvidePlugin({
         $ : "jquery",
         jQuery : "jquery",
         "window.jQuery" : "jquery",
         "root.jQuery" : "jquery"
     }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'source-map'
};
