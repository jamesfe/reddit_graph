var path = require('path');
var webpack = require('webpack');
// http://jamesknelson.com/webpack-made-simple-build-es6-less-with-autorefresh-in-26-lines/
// http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack/

module.exports = {
  entry: [
    'babel-polyfill',
    './src/renderGraphs.js'
  ],
  output: {
    filename: 'bundle.js',
    publicPath: path.resolve(__dirname),
    path: path.resolve(__dirname, 'public', 'dist')
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname)
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: "post",
        loader: "jshint-loader"
      }
    ],
    loaders: [
      {
        loader: 'babel-loader',

        // Skip any files outside of your project's `src` and `public` directory
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'public')
        ],
        exclude: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'public', 'dist'),
        ],
        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        // Options to configure babel with
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015'],
        }
      }
    ]
  }
};
