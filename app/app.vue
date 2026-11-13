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
      type: "image/svg+xml",
      href: "/logos/emaapou-icon.svg",
    },
  ],
});

const img = useImage();
useSeoMeta({
  description: "Web portal for geoscience data from Estonia. Provides direct search capabilities to SARV information system and links to other data sources",
  ogImage: img("logos/emaapou_short.png"),
  ogImageWidth: 200,
  ogImageHeight: 200,
  themeColor: "#616161",
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>