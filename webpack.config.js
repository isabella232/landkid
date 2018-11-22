const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// This only really matters when building files, not in production
const outputPath = process.env.OUTPUT_PATH || '.';

module.exports = {
  entry: {
    bitbucket: path.resolve(__dirname, './src/static/bitbucket/index'),
    'current-state': path.resolve(
      __dirname,
      './src/static/current-state/index',
    ),
  },
  output: {
    path: path.resolve(outputPath),
    publicPath: '/',
    filename: '[name]/bundle.[chunkhash].js',
  },
  mode: 'development',
  devServer: {
    compress: true,
    historyApiFallback: true,
    // hot: true,
    port: 3000,
    publicPath: '/',
    stats: 'errors-only',
    proxy: {
      '/api': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
      '/bitbucket': 'http://localhost:8080',
      '/ac': 'http://localhost:8080',
    },
    public: fs.existsSync('./config')
      ? require('./config').baseUrl.replace('https://', '')
      : undefined,
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: [
          {
            loader: require.resolve('cache-loader'),
            options: {
              cacheDirectory: path.resolve(
                __dirname,
                'node_modules',
                '.build-cache',
                'ts',
              ),
            },
          },
          {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'bitbucket/index.html',
      // only inject the code from the 'bitbucket' entry/chunk
      chunks: ['bitbucket'],
      template: path.resolve(__dirname, './src/static/bitbucket/index.html'),
    }),
    new HtmlWebpackPlugin({
      filename: 'current-state/index.html',
      // only inject the code from the 'current-state' entry/chunk
      chunks: ['current-state'],
      template: path.resolve(
        __dirname,
        './src/static/current-state/index.html',
      ),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      // should't need any chunks for the home page
      chunks: [],
      template: path.resolve(__dirname, './src/static/index.html'),
    }),
  ],
};
