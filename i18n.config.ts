import en from "./app/lang/en";
import et from "./app/lang/et";

export default defineI18nConfig(() => {
  return {
    legacy: false,
    availableLocales: ["et", "en"],
    fallbackLocale: "et",
    fallbackWarn: true,
  };
});
