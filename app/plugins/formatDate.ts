export default defineNuxtPlugin((_nuxtApp) => {
  const formatDate = (isoDate: string): string => {
    return isoDate ? new Date(isoDate).toISOString().split("T")[0] : isoDate;
  };
  return {
    provide: { formatDate },
  };
});
