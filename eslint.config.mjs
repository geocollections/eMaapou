import antfu from "@antfu/eslint-config";

import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  antfu({
    stylistic: {
      semi: true,
      quotes: "double",
    },
  }, {
    rules: {
      "vue/component-name-in-template-casing": ["error", "PascalCase", {
        registeredComponentsOnly: false,
        ignores: ["/^swiper-/"],
      }],
      "vue/max-attributes-per-line": ["error", {
        singleline: {
          max: 2,
        },
        multiline: {
          max: 1,
        },
      }],
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
  }),
);
