type Translation = {
  et: string;
  en: string;
};

export default defineNuxtPlugin(({ $i18n }) => {
  function translate(translations: Translation) {
    // @ts-ignore
    return $i18n.locale.value === "et" ? translations.et : translations.en;
  }
  return {
    provide: {
      translate,
    },
  };
});
