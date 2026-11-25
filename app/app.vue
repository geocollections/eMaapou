<script setup lang="ts">
const { locale, t } = useI18n();

useHead({
  titleTemplate: (title) => {
    if (!title)
      return t("title");

    return t("portal.site.titleTemplate", {
      title,
      site: t("title"),
    });
  },
  htmlAttrs: {
    lang: locale,
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
  description: () => t("portal.site.description"),
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
