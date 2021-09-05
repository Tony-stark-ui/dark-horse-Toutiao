module.exports = {

  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-pxtorem")({
            // 把px单位换算成rem单位
            rootValue: 37.5, // 换算的基数(设计图750的根字体为75)
            // selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
            propList: ["*"],
          }),
        ],
      },
    },
  },
  configureWebpack: {
    // 配置路径别名
    resolve: {
      alias: {
        'components': '@/components',
        'content': 'components/content',
        'common': '@/common',
        'assets': '@/assets',
        'network': '@/network',
        'views': '@/views',
        'utils': '@/utils',
        'store': '@/store'
      }
    },

  },
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://api-toutiao-web.itheima.net',
        target: 'http://ttapi.research.itcast.cn/',
        // target: 'http://toutiao-app.itheima.net',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api/': ''
        }
      },
      '/socket.io': {
        target: 'http://ttapi.research.itcast.cn/', // target host
        changeOrigin: true, // needed for virtual hosted sites
        logLevel: 'debug'
      }
    }
  }
}
