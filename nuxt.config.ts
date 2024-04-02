import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: {
    dirs: [
      {
        path: "~/components",
        pathPrefix: false,
      },
      {
        path: "~/templates",
        pathPrefix: false,
      },
    ],
  },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/google-fonts",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
  ],
  imports: {
    dirs: ["types", "constants"],
  },
  i18n: {
    locales: [
      {
        code: "en",
        iso: "et-US",
        file: "en.js",
        name: "English",
      },
      {
        code: "et",
        iso: "et-EE",
        file: "et.js",
        name: "Eesti",
      },
    ],
    lazy: true,
    langDir: "lang/",
    defaultLocale: "et",
    strategy: "prefix_and_default",
    baseUrl: "https://geoloogia.info",
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
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
  site: {
    indexable: false,
  },
  linkChecker: {
    enabled: false,
  },
});
