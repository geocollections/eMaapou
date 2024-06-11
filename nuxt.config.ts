// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: {
    dirs: [
      {
        path: "~/components",
        pathPrefix: false,
      },
    ],
  },
  build: {
    transpile: ["vuetify"],
  },
  typescript: {
    strict: true,
  },
  modules: [
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/google-fonts",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
    "vuetify-nuxt-module",
    "@nuxt/test-utils/module",
  ],
  imports: {
    dirs: ["types", "constants"],
  },
  css: ["~/assets/main.scss"],
  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        viewportSize: true,
      },
    },
    vuetifyOptions: {
      icons: {
        defaultSet: "mdi-svg",
      },
      theme: {

        defaultTheme: "light",
        variations: {
          colors: ["primary", "secondary", "accent"],
          lighten: 5,
          darken: 5,
        },
        themes: {
          dark: {
            dark: true,
            colors: {
              primary: "#7c8996",
              secondary: "#cfd6dc",
              tertiary: "#333333",
              quaternary: "#fff",
              quinary: "#fcf2df",
              anchor: "#5a5957",
              header: "#3091b5",
              accent: "#577daf",
            },
          },
          light: {
            dark: false,
            colors: {
              background: "#ffffff",
              primary: "#7c8996",
              secondary: "#cfd6dc",
              tertiary: "#333333",
              quaternary: "#fff",
              quinary: "#fcf2df",
              anchor: "#5a5957",
              header: "#3091b5",
              // accent: "#577daf",
              accent: "#ec643b",
            },
          },
        },
      },
    },
  },
  i18n: {
    locales: [
      {
        code: "en",
        iso: "et-US",
        // file: "en.js",
        name: "English",
      },
      {
        code: "et",
        iso: "et-EE",
        // file: "et.js",
        name: "Eesti",
      },
    ],
    // lazy: true,
    // langDir: "lang/",
    defaultLocale: "et",
    strategy: "prefix_and_default",
    baseUrl: "https://geoloogia.info",
    vueI18n: "./i18n.config.ts",
  },
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith("swiper-"),
    },
  },
  googleFonts: {
    families: {
      // @ts-expect-error - This is a valid font config. Disables automatic Roboto font loading.
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
  linkChecker: {
    enabled: false,
  },
});
