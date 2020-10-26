const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge').merge;
const VueLoaderPlugin = require('vue-loader/dist/plugin').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackBaseConfig = require('./webpack.config.js');

module.exports = merge(webpackBaseConfig, {
  mode: 'development',
  entry: {
    app: './examples/index.js',
  },
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /./, to: '/index.html' }],
    },
    disableHostCheck: true,
    hot: true,
    open: true,
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: 'examples/index.html',
      filename: 'index.html',
      inject: true,
    }),
    new VueLoaderPlugin(),
    new DashboardPlugin({
      port: 3001,
    }),
  ],
});
