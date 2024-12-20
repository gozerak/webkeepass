const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // Входная точка
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  mode: process.env.NODE_ENV || 'development', // Режим сборки
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // Поддержка JS/TS
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/, // Поддержка CSS
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devServer: {
    static: path.resolve(__dirname, 'public'),
    hot: true,
    open: true,
    host: '10.14.113.135',
    port: 8080,
    historyApiFallback: true,
    // https: {
    //     key: fs.readFileSync('./serts/mail.komos-group.ru_2024_unencrypted.key'),
    //     cert: fs.readFileSync('./serts/mail.komos-group.ru_2024.crt'),
    //   },
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync('./serts/mail.komos-group.ru_2024_unencrypted.key'),
        cert: fs.readFileSync('./serts/mail.komos-group.ru_2024.crt')
      }
    },
    allowedHosts: ['dev.komos-group.ru', '10.14.113.135']
    },
  //   allowedHosts: [
  //     'dev.komos-group.ru',
  //     '10.14.113.135'
  // ],
    // allowedHosts: 'all',
    // historyApiFallback: true, // Для работы с React Router
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Шаблон HTML
      filename: 'index.html',
      inject: true
    }),
  ],
};
