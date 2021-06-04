// import colors from 'vuetify/es5/util/colors'
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
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'e-Maapõu',
        template: (chunk) => `${chunk} | e-Maapõu`,
      },
      {
        property: 'og:type',
        content: 'website',
        hid: 'og:type',
      },
      {
        property: 'og:description',
        content:
          'e-Maapõu is web portal for geoscience data from Estonia. It provides direct search capabilities to information system SARV and links to other relevant data sources',
        hid: 'og:description',
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
    hostname: 'https://geoloogia.info',
    path: '/sitemap.xml',
    i18n: {
      locales: ['et', 'en'],
      routesNameSeparator: '___',
    },
    gzip: true,
    generate: true,
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
          primary: '#7c8996',
          secondary: '#cfd6dc',
          tertiary: '#333333',
          quaternary: '#fff',
          quinary: '#fcf2df',
          anchor: '#5a5957',
          header: '#3091b5',
          accent: '#327b96',
          success2: '#7bbc9a',
          'emp-main': '#7bbc9a',
          'emp-stratigraphy': '#accb95',
          'emp-analysis': '#7ea3ca',
          'emp-dataset': '#e49e5c',
          'emp-sample': '#bc7b7b',
          'emp-drillcore': '#8f7e9f',
          'emp-locality': '#c78a6e',
          'emp-site': '#7bbc9a',
          'emp-photo': '#ab9f93',
        },
        light: {
          primary: '#7c8996',
          secondary: '#cfd6dc',
          tertiary: '#333333',
          quaternary: '#fff',
          quinary: '#fcf2df',
          anchor: '#5a5957',
          header: '#3091b5',
          accent: '#327b96',
          success2: '#7bbc9a',
          'emp-main': '#7bbc9a',
          'emp-stratigraphy': '#accb95',
          'emp-analysis': '#7ea3ca',
          'emp-dataset': '#e49e5c',
          'emp-sample': '#bc7b7b',
          'emp-drillcore': '#8f7e9f',
          'emp-locality': '#c78a6e',
          'emp-site': '#7bbc9a',
          'emp-photo': '#ab9f93',
        },
      },
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vue-echarts', 'resize-detector'],
    // Setting cssSoruceMap and cacheBusting to false fixes chrome dev tools style change problem (broke styles)
    cssSourceMap: false,
    cacheBusting: false,
  },
}
