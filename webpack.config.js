const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  entry: './src/main.ts', // Reemplaza './src/index.js' con la ruta de tu archivo de entrada principal
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
};