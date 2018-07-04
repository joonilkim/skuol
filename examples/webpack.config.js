const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {

  mode: 'development',

  entry: './src/index.js',

  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '__dist__'),
  },

  resolve: {
    alias: {
      skuol: path.resolve(__dirname, '../src')
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['transform-object-rest-spread']
          }
        }
      },
      { 
        test: /\.scss$/, 
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'] 
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ]

}
