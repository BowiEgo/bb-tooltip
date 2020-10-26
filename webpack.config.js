const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(vue|md)$/,
        loader: 'vue-loader',
        exclude: /\.(en-US.md|zh-CN.md)$/,
      },
      {
        test: /\.(en-US.md|zh-CN.md)$/,
        use: [{ loader: 'vue-loader' }],
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: [
                    'last 2 versions',
                    'Firefox ESR',
                    '> 1%',
                    'ie >= 9',
                    'iOS >= 8',
                    'Android >= 4',
                  ],
                },
              },
            ],
          ],
          plugins: [
            [
              'babel-plugin-import',
              {
                libraryName: 'bb-tooltip',
                libraryDirectory: '', // default: lib
                style: true,
              },
            ],
            ['@vue/babel-plugin-jsx'],
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-transform-object-assign',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: true,
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
            },
          },
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, './src'),
      vue$: 'vue/dist/vue.esm-bundler.js',
    },
    extensions: ['.js', '.jsx', '.vue', '.md'],
  },
};
