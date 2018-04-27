var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 环境变量配置，dev / online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

// webpack config
var config = {
  /*
        *【新增】：新增mode参数，webpack4中要指定模式，可以放在配置文件这里，也可以放在启动命令里，如--mode production
    */
  mode: WEBPACK_ENV === 'dev' ? 'development' : 'production',
  /*
    * 【改动】：删除了入口文件的中括号，可选的改动，没什么影响
    */
  entry: {
    app: './src/app.js'
  },
  output: {
    /*
        * 【改动】：删除path的配置，在webpack4中文件默认生成的位置就是/dist,
        *  而publicPath和filename特性的设置要保留
        */
    // path        : __dirname + '/dist/',
    // publicPath 表示资源的发布地址，当配置过该属性后，打包文件中所有通过相对路径引用的资源都会被配置的路径所替换
    publicPath: WEBPACK_ENV === 'dev' ? '../dist' : '',
    filename: '[name].js'
  },
  externals: {
    $: 'window.zepto'
  },
  module: {
    /*
        * 【改动】：loader的使用中，loaders字段变为rules，用来放各种文件的加载器，用rules确实更为贴切
        */
    rules: [
      // pre 预编译校验代码规范
      // {
      //   test: /\.(js|san)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   exclude: /node_modules/,
      //   include: [path.join(__dirname, 'src')],
      //   options: {
      //      formatter: require('eslint-friendly-formatter')
      //   }
      // },
      // san文件处理
      {
        test: /\.san$/,
        loader: 'san-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: [path.join(__dirname, 'src')]
      },
      /*
        * 【改动】：css样式的加载方式变化
        */
      // css文件的处理
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //  resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader']
        })
      },
      /*
            * 【改动】：图片文件的加载方式变化，并和字体文件分开处理
            */
      // 图片的配置
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              /*
                * 【改动】：图片小于2kb的按base64打包
                */
              name: 'static/img/[name].[ext]',
              limit: 2048,
              fallback: 'responsive-loader'
            }
          }
        ]
      },
      /*
            * 【改动】：字体文件的加载方式变化
            */
      // 字体图标的配置
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'static/font/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  //  加入source-map，方便调试
  devtool: WEBPACK_ENV === 'dev' ? '#source-map' : false,
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  /*
    * 【新增】：webpack4里面移除了commonChunksPulgin插件，替换成了splitChunks,放在了config.optimization里面
    */
  optimization: {
    runtimeChunk: false,
    splitChunks : {
      chunks: 'initial', // 必须三选一： 'initial' | 'all'(默认就是all) | 'async'
      minSize: 0, // 最小尺寸，默认0
      minChunks: 1, // 最小 chunk ，默认1
      maxAsyncRequests: 1, // 最大异步请求数， 默认1
      maxInitialRequests: 1, // 最大初始化请求书，默认1
      cacheGroups: {
        priority: '0', // 缓存组优先级 false | object |
        app: {
          // key 为entry中定义的 入口名称
          test: /[\\/]node_modules[\\/]/, // 正则规则验证，如果符合就提取 chunk
          name: 'common', // 要缓存的 分隔出来的 chunk 名称
          chunks: 'all', // 必须三选一： 'initial' | 'all'(默认就是all) | 'async'
          minSize: 0,
          minChunks: 2,
          enforce: true,
          maxAsyncRequests: 1, // 最大异步请求数， 默认1
          maxInitialRequests: 1, // 最大初始化请求书，默认1
          reuseExistingChunk: true // 可设置是否重用该chunk（查看源码没有发现默认值）
        }
      }
    }
  },
  plugins: [
    /*
        * 【移除】：webpack4里面移除了commonChunksPulgin插件
        */
    // // 独立通用模块到js/base.js
    // new webpack.optimize.CommonsChunkPlugin({
    //     name : 'common',
    //     filename : 'js/base.js'
    // }),
    // 把css单独打包到文件里
    new ExtractTextPlugin('[name].css'),
    // html模板的处理
    new HtmlWebpackPlugin({
      template: './index.html', //  根据自己的指定的模板文件来生成特定的 html 文件。这里的模板类型可以是任意你喜欢的模板，可以是 html, jade, ejs, hbs, 等等，但是要注意的是，使用自定义的模板文件时，需要提前安装对应的 loader， 否则webpack不能正确解析
      filename: 'index.html', // 默认情况下生成的 html 文件叫 index.html
      minify: {
        collapseWhitespace: true //  把生成的 index.html 文件的内容的没用空格去掉，减少空间
      },
      hash: true
    })
  ],
  /*
    * 【新增】：在v1.0.1版本中新增了devServer的配置，用自带的代理就可以访问接口
    */
  devServer: {
    contentBase: path.join(__dirname, '/dist'),
    port: 8088,
    open: true,
    inline: true
    // proxy: {
    //   '**/*.do': {
    //     target: 'http://jinuwu.li',
    //     changeOrigin: true
    //   }
    // }
  }
};

module.exports = config;
