<script setup lang="ts">
const { locale } = useI18n();

useHead({
  titleTemplate: (title) => {
    if (!title)
      return locale.value === "et" ? "eMaapõu" : "Geocollections";

    return locale.value === "et" ? `${title} | eMaapõu` : `${title} | Geocollections`;
  },
  htmlAttrs: {
    lang: locale.value,
  },
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    },
  ],
});

const img = useImage();
useSeoMeta({
  description: "Web portal for geoscience data from Estonia. Provides direct search capabilities to SARV information system and links to other data sources",
  ogImage: img("logos/emaapou_short.png"),
  themeColor: "#616161",
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
