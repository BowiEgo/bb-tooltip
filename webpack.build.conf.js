const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge').merge;
const webpackBaseConfig = require('./webpack.config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'bb-tooltip.js',
    library: 'bb-tooltip',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
});

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]);
  module.exports.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
      }),
    ],
  };
}
