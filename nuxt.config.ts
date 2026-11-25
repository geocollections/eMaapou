export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  devtools: {
    enabled: true,
    componentInspector: false,
  },
  components: {
    dirs: [
      {
        path: "~/components",
        pathPrefix: false,
      },
    ],
  },
  typescript: {
    strict: true,
  },
  ui: {
    colorMode: false,
  },
  app: {
    head: {
      htmlAttrs: {
        class: "light",
      },
    },
  },
  modules: [
    "@nuxt/fonts",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/google-fonts",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
    "vuetify-nuxt-module",
    "@nuxt/test-utils/module",
  ],
  imports: {
    dirs: ["types", "constants"],
  },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
        },
      },
    },
  },
  vuetify: {
    moduleOptions: {
      importComposables: false,
    },
    vuetifyOptions: {
      icons: {
        defaultSet: "mdi-svg",
      },

    },
  },
  i18n: {
    locales: [
      {
        code: "en",
        language: "en-US",
        file: "en.json",
      },
      {
        code: "et",
        language: "et-EE",
        file: "et.json",
      },
    ],
    restructureDir: "app/i18n",
    langDir: ".",
    defaultLocale: "et",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirect",
      redirectOn: "no prefix",
    },
    strategy: "prefix_and_default",
    baseUrl: "https://geoloogia.info",
  },
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith("swiper-"),
    },
  },
  googleFonts: {
    families: {
      "Roboto": false,
      "Montserrat": [300, 400, 500, 700],
      "Noto+Sans": [400, 500, 700],
      "Noto+Sans+Mono": [400, 500, 700],
    },
  },
  image: {
    providers: {
      geocollections: {
        name: "geocollections",
        provider: "~/providers/geocollections.ts",
        options: {
          baseURL: "https://files.geocollections.info/",
        },
      },
    },
  },
  seo: {
    automaticTwitterTags: false,
  },
  linkChecker: {
    enabled: false,
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  compatibilityDate: "2024-09-10",
  sourcemap: {
    server: false,
    client: true,
  },
});
