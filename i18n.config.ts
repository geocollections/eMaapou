export default defineI18nConfig(() => {
  return {
    legacy: false,
    availableLocales: ["et", "en"],
    fallbackLocale: "et",
    fallbackWarn: true,
  };
});
