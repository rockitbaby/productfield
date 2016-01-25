'use strict';
const webpack = require('webpack');

module.exports = {
  entry: {
    client: 'webpack-dev-server/client?http://localhost:8080',
    index: ['./src/index.jsx', 'webpack/hot/only-dev-server'],
    component_library: './src/component_library.jsx'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel'
    },{
      test: /\.css$/, // Only .css files
      loader: 'style!css' // Run both loaders
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
