export default {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "plugin:nuxt/recommended",
    "prettier",
    "plugin:vuetify/base",
  ],
  // add your custom rules here
  rules: {
    "vue/valid-v-slot": [
      "error",
      {
        allowModifiers: true,
      },
    ],
    "vue/no-v-html": "off",
    "no-unused-vars": "off",
    "vue/multi-word-component-names": "off",
  },
};
