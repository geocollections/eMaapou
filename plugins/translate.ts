interface Translation {
  et: string;
  en: string;
}

export default defineNuxtPlugin(({ $i18n }) => {
  function translate(translations: Translation) {
    // eslint-disable-next-line ts/no-unsafe-member-access
    return (($i18n as any).locale.value) === "et" ? translations.et : translations.en;
  }
  return {
    provide: {
      translate,
    },
  };
});
