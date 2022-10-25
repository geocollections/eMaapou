module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
    requireConfigFile: false,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'eslint:recommended',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
  ],
  // add your custom rules here
  rules: {
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: true,
      },
    ],
    'vue/no-v-html': 'off',
    'no-unused-vars': 'off',
  },
}
