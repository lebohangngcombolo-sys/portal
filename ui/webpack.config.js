const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production' ||
  (process.env.WEBPACK_SERVE ? false : true);
const PORT = Number(process.env.PORT) || 3000;
const BFF_URL = process.env.BFF_URL || 'http://localhost:8080';

module.exports = (env, argv) => {
  const mode = argv.mode || (isProduction ? 'production' : 'development');
  const dev = mode === 'development';

  return {
    mode,
    entry: {
      main: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: dev ? '[name].js' : '[name].[contenthash:8].js',
      chunkFilename: dev ? '[name].chunk.js' : '[name].[contenthash:8].chunk.js',
      assetModuleFilename: 'static/media/[name].[hash:8][ext]',
      publicPath: '/',
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      fallback: {
        // tb-state uses no Node builtins — this silences webpack 5 warnings
        fs: false,
        path: false,
      },
    },
    devtool: dev ? 'eval-cheap-module-source-map' : 'source-map',
    devServer: {
      port: PORT,
      hot: true,
      historyApiFallback: true,
      static: [
        {
          directory: path.resolve(__dirname, 'public'),
          publicPath: '/',
        },
        {
          directory: path.resolve(__dirname, '../portal-config'),
          publicPath: '/',
        },
      ],
      client: {
        overlay: { errors: true, warnings: false },
        progress: true,
      },
      proxy: [
        {
          context: ['/api'],
          target: BFF_URL,
          changeOrigin: true,
          secure: false,
        },
      ],
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules\/(?!tb-state)/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                ['@babel/preset-env', { targets: { browsers: 'last 2 versions, not dead' }, modules: false }],
                ['@babel/preset-react', { runtime: 'automatic' }],
              ],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/media/[name].[hash:8][ext]',
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/fonts/[name].[hash:8][ext]',
          },
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
            name: 'react',
            priority: 20,
          },
          i18n: {
            test: /[\\/]node_modules[\\/](i18next|react-i18next|i18next-http-backend)[\\/]/,
            name: 'i18n',
            priority: 15,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
          },
        },
      },
      runtimeChunk: 'single',
    },
    performance: {
      hints: dev ? false : 'warning',
      maxEntrypointSize: 1_500_000,
      maxAssetSize: 900_000,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.BFF_URL': JSON.stringify(BFF_URL),
        'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV || 'local'),
        'process.env.ENABLE_FARO': JSON.stringify(process.env.ENABLE_FARO || 'false'),
        'process.env.FARO_URL': JSON.stringify(process.env.FARO_URL || ''),
        'process.env.DEFAULT_LOCALE': JSON.stringify(process.env.DEFAULT_LOCALE || 'en'),
        'process.env.SUPPORTED_LOCALES': JSON.stringify(process.env.SUPPORTED_LOCALES || 'en,pt'),
        'process.env.TOKEN_REFRESH_THRESHOLD_SECONDS': JSON.stringify(
          process.env.TOKEN_REFRESH_THRESHOLD_SECONDS || '120',
        ),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        favicon: path.resolve(__dirname, 'public/favicon.ico'),
        inject: 'body',
        minify: dev ? false : {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public/manifest.json'),
            to: 'manifest.json',
          },
          {
            from: path.resolve(__dirname, '../portal-config/assets'),
            to: 'assets',
          },
        ],
      }),
    ],
    stats: dev ? 'minimal' : 'normal',
  };
};