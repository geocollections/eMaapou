import "@mdi/font/css/materialdesignicons.css";

import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

import "~/assets/main.scss";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
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
            background: "#fafafa",
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
      },
    },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
    // ... your configuration
  });
  app.vueApp.use(vuetify);
});
