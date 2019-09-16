const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    library: 'Umc',
    libraryTarget: 'umd',
    filename: 'umc-ui.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: {
    jquery: 'jQuery'
  }
};