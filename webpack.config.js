const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');

const DEV = process.env.NODE_ENV === 'development';

const WebpackConfig = {

  resolve: {
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },

  mode: DEV
    ? 'development'
    : 'production',

  entry: {
    'control/content/content': [path.join(__dirname, 'src/control/content/index.js')],
    'control/design/design': [path.join(__dirname, 'src/control/design/index.js')],
    'control/settings/settings': [path.join(__dirname, 'src/control/settings/index.js')],
    'widget/widget': [path.join(__dirname, 'src/widget/index.js')]
  },

  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },

  externals: {
    buildfire: 'buildfire'
  },

  plugins: [],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: 'babel-loader'
    }]
  }

};

// Development only settings
if (DEV) {
  WebpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  WebpackConfig.plugins.push(new CopyWebpackPlugin([{
    from: path.join(__dirname, '../../styles'),
    to: path.join(__dirname, '../styles'),
  }, {
    from: path.join(__dirname, '../../scripts'),
    to: path.join(__dirname, '../scripts'),
  }, {
    from: path.join(__dirname, '../../fonticons'),
    to: path.join(__dirname, '../fonticons'),
  }]));

  WebpackConfig.plugins.push(new CopyWebpackPlugin([{
    from: path.join(__dirname, '../../styles'),
    to: path.join(__dirname, './dist/styles'),
  }, {
    from: path.join(__dirname, '../../scripts'),
    to: path.join(__dirname, './dist/scripts'),
  }, {
    from: path.join(__dirname, '../../fonticons'),
    to: path.join(__dirname, './dist/fonticons'),
  }]));

  WebpackConfig.module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  });
  WebpackConfig.module.rules.push({
    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
    loader: 'url-loader?limit=100000'
  });
  WebpackConfig.devServer = {
    hot: true,
    host: '0.0.0.0',
    port: 8082,
    contentBase: path.join(__dirname, '/public'),
    publicPath: '/',
    disableHostCheck: true,
    historyApiFallback: true,
    stats: 'errors-only',
    noInfo: false,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    overlay: true,
    inline: true
  };
}

// Production only settings
if (!DEV) {
  WebpackConfig.output.filename = '[name].[chunkhash].js';
  WebpackConfig.stats = 'normal';

  WebpackConfig.plugins.push(
    new CleanWebpackPlugin(['dist'], { verbose: false }),
    new webpack.HashedModuleIdsPlugin(),
    new ExtractTextPlugin('style.[chunkhash].css'),
    new UglifyWebpackPlugin()
  );

  WebpackConfig.module.rules.push({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: { importLoaders: 1 }
        }
      ]
    })
  });
}

// Global settings
WebpackConfig.plugins.push(
  new HtmlWebpackPlugin({
    filename: 'control/content/index.html',
    minify: { removeComments: true, collapseWhitespace: true },
    template: path.join(__dirname, 'src/control/content/index.html'),
    chunks: ['control/content/content']
  }),
  new HtmlWebpackPlugin({
    filename: 'control/design/index.html',
    minify: { removeComments: true, collapseWhitespace: true },
    template: path.join(__dirname, 'src/control/design/index.html'),
    chunks: ['control/design/design']
  }),
  new HtmlWebpackPlugin({
    filename: 'control/settings/index.html',
    minify: { removeComments: true, collapseWhitespace: true },
    template: path.join(__dirname, 'src/control/settings/index.html'),
    chunks: ['control/settings/settings']
  }),
  new HtmlWebpackPlugin({
    filename: 'widget/index.html',
    minify: { removeComments: true, collapseWhitespace: true },
    template: path.join(__dirname, 'src/widget/index.html'),
    chunks: ['widget/widget']
  }),
  new CopyWebpackPlugin([{
    from: path.join(__dirname, 'src/control'),
    to: path.join(__dirname, 'control'),
  }, {
    from: path.join(__dirname, 'src/widget'),
    to: path.join(__dirname, 'dist/widget'),
  }, {
    from: path.join(__dirname, 'src/resources'),
    to: path.join(__dirname, 'dist/resources'),
  }, {
    from: path.join(__dirname, 'plugin.json'),
    to: path.join(__dirname, 'dist/plugin.json'),
  }], {
    ignore: ['*.js', '*.html', '*.md']
  })
);

module.exports = WebpackConfig;
