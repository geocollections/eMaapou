import en from "./lang/en";
import et from "./lang/et";

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: "et",
    messages: {
      en,
      et,
    },
  };
});
