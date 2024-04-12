import antfu from "@antfu/eslint-config";

// import { FlatCompat } from "@eslint/eslintrc";
// const compat = new FlatCompat();

export default antfu(
  {
    stylistic: {
      semi: true,
      quotes: "double",
    },
    typescript: {
      tsconfigPath: "./.nuxt/tsconfig.json",
    },
  },
  {
    rules: {
      "vue/component-name-in-template-casing": ["error", "PascalCase", {
        registeredComponentsOnly: false,
        igrores: ["/^swiper-/"],
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
  },
  // ...compat.config({
  //   extends: ["plugin:vuetify/recommended"],
  // }),
);
