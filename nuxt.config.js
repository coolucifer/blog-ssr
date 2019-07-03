
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon_icon.png' },
      { rel: 'stylesheet', href: '//at.alicdn.com/t/font_784085_25wsqhd6xxm.css' },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#666' },
  /*
  ** Global CSS
  */
  css: [
    'assets/css/common.css',
    'element-ui/lib/theme-chalk/index.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '@/plugins/element-ui',
      ssr: true,
    },
    '@/plugins/axios',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true,
  },
  proxy: {
    '/api': {
      target: 'https://doco.dev',
      // 开启跨域
      changeOrigin: true,
    },
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
    loaders: {
      // 100k以下的图片会被编译为base64
      imgUrl: { limit: 100000 },
    },
  },
};
