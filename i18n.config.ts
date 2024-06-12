import en from "./app/lang/en";
import et from "./app/lang/et";

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
