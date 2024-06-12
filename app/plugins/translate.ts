interface Translation<T1, T2> {
  et: T1;
  en: T2;
}

export default defineNuxtPlugin(({ $i18n }) => {
  function translate<T1 extends string | null | undefined, T2 extends string | null | undefined>(translations: Translation<T1, T2>) {
    // eslint-disable-next-line ts/no-unsafe-member-access
    return (($i18n as any).locale.value) === "et" ? translations.et : translations.en;
  }
  return {
    provide: {
      translate,
    },
  };
});
