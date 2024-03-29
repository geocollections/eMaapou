// import colors from 'vuetify/es5/util/colors'
// import axios from 'axios'

import { NuxtConfig } from '@nuxt/types'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | eMaapõu',
    title: 'eMaapõu',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'google-site-verification',
        content: 'CnPurdkcMVMZY8EqnoCZj4sHEq4rLZ0Ba5_CXCXdbFg',
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'Web portal for geoscience data from Estonia. Provides direct search capabilities to SARV information system and links to other data sources',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'e-Maapõu',
        template: (chunk) => `${chunk} | e-Maapõu`,
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Web portal for geoscience data from Estonia. Provides direct search capabilities to SARV information system and links to other data sources',
      },
      {
        hid: 'og:locale',
        property: 'og:locale',
        content: 'et_EE',
      },
      {
        hid: 'og:locale:alternate',
        property: 'og:locale:alternate',
        content: 'en_US',
      },
      { hid: 'og:site_name', property: 'og:site_name', content: 'e-Maapõu' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: '',
        template: (chunk) => `https://geoloogia.info${chunk}`,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        // https://stackoverflow.com/a/15553994
        // TODO: change to geoloogia.info after emaapou_short.png is pushed to production branch
        content: 'https://dev.geoloogia.info/logos/emaapou_short.png?t=12345?',
      },
      { name: 'theme-color', content: '#577daf' },
      { name: 'apple-mobile-web-app-status-bar-sytle', content: '#577daf' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  loading: false,
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/styles'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/translate.ts',
    { src: '~/plugins/infiniteLoading.js', mode: 'client' },
    '~plugins/services.ts',
    '~plugins/openWindow.ts',
    '~plugins/hydrateTabs.ts',
    '~plugins/getAPIFieldValues.ts',
    { src: '~plugins/vuexPersist.js', mode: 'client' },
    { src: '~plugins/afterEach.ts', mode: 'client' },
    { src: '~plugins/xlsx.ts', mode: 'client' },
    '~/plugins/formatDate.ts',
    { src: '~/plugins/vueMatomo.ts', mode: 'client' },
    { src: '~/plugins/vue-stack-grid.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module',
    '@nuxt/typescript-build',
    'nuxt-typed-vuex',
    '@nuxtjs/google-fonts',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxt/image',
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
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'https://api.geoloogia.info',
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
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['@/assets/variables.scss'],
    defaultAssets: {
      font: undefined,
      icons: undefined,
    },
    treeShake: true,
    icons: {
      iconfont: 'mdiSvg',
    },
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
          accent: '#577daf',
        },
        light: {
          primary: '#7c8996',
          secondary: '#cfd6dc',
          tertiary: '#333333',
          quaternary: '#fff',
          quinary: '#fcf2df',
          anchor: '#5a5957',
          header: '#3091b5',
          accent: '#577daf',
        },
      },
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'vue-echarts',
      'resize-detector',
      'echarts/core',
      'echarts/renderers',
      'echarts/charts',
      'echarts/components',
      'zrender',
    ],
  },
  googleFonts: {
    families: {
      Montserrat: [300, 400, 500, 700],
      'Open+Sans': [400, 500, 700],
    },
    preload: true,
  },
  image: {
    providers: {
      geocollections: {
        name: 'geocollections',
        provider: require.resolve('./providers/geocollections.ts'),
        options: {
          baseURL: 'https://files.geocollections.info/',
        },
      },
    },
  },
  typescript: {
    typeCheck: {
      eslint: {
        files: './**/*.{ts,js,vue}',
      },
    },
  },
  serverMiddleware: [{ path: '/_ipx', handler: '~/server/middleware/ipx.js' }],
} as NuxtConfig
