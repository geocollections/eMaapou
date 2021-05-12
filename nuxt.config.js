import colors from 'vuetify/es5/util/colors'

// import axios from 'axios'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | e-Maapõu',
    title: 'e-Maapõu',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'e-Maapõu is web portal for geoscience data from Estonia. It provides direct search capabilities to information system SARV and links to other relevant data sources',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Montserrat&display=swap',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/styles'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/translate.js',
    { src: '~/plugins/infiniteLoading.js', mode: 'client' },
    '~plugins/services.js',
    { src: '~plugins/leaflet.js', mode: 'client' },
    '~plugins/openWindow.js',
    '~plugins/hydrateTabs.js',
    '~plugins/getQueryFields.js',
    { src: '~plugins/gtag.js', mode: 'client' },
    { src: '~plugins/vuexPersist.js', mode: 'client' },
    { src: '~plugins/afterEach.js', mode: 'client' },
    { src: '~plugins/vueECharts.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-i18n',
    '@nuxtjs/sitemap',
  ],

  sitemap: {
    // routes() {
    //   return axios.get('/sitemap/ema')
    // },
    path: '/sitemap.xml',
    gzip: true,
    generate: false,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'https://api.geocollections.info',
  },

  // i18n module configuration
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'et-US',
        file: 'en.js',
        name: 'English',
      },
      {
        code: 'et',
        iso: 'et-EE',
        file: 'et.js',
        name: 'Eesti',
      },
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'et',
    strategy: 'prefix_and_default',
    detectBrowserLanguage: {
      useCookie: true,
      onlyOnRoot: true,
      fallbackLocale: 'et',
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['@/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      options: {
        customProperties: true,
      },
      themes: {
        dark: {
          // primary: colors.blue.darken2,
          // accent: colors.grey.darken3,
          // secondary: colors.amber.darken3,
          // info: colors.teal.lighten1,
          // warning: colors.amber.base,
          // error: colors.deepOrange.accent4,
          // success: colors.green.accent3,
          primary: '#7c8996',
          secondary: '#cfd6dc',
          tertiary: '#333333',
          quaternary: '#fff',
          quinary: '#fcf2df',
          anchor: '#5a5957',
          accent: '#3d8661',
          success2: '#7bbc9a',
          'emp-main': '#7bbc9a',
          'emp-stratigraphy': '#cb8c37',
          'emp-analysis': '#80a8c2',
          'emp-sample': '#bc7b7b',
          'emp-drillcore': '#8f7e9f',
          'emp-locality': '#7bbc9a',
          'emp-site': '#8ba56c',
          // primary: '#009270',
          // secondary: '#bfe6cf',
          // tertiary: '#333333',
          // quaternary: '#F7F7FF',
          // quinary: '#fcf2df',
          // anchor: '#009270',
        },
        light: {
          primary: '#7c8996',
          secondary: '#cfd6dc',
          tertiary: '#333333',
          quaternary: '#f3f0ec',
          quinary: '#627aa2',
          anchor: '#5b4033',
          accent: '#3d8661',
          success2: '#7bbc9a',
          'emp-main': '#7bbc9a',
          'emp-stratigraphy': '#cb8c37',
          'emp-analysis': '#80a8c2',
          'emp-sample': '#bc7b7b',
          'emp-drillcore': '#8f7e9f',
          'emp-locality': '#7bbc9a',
          'emp-site': '#8ba56c',
        },
      },
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vue-echarts', 'resize-detector'],
  },
}
