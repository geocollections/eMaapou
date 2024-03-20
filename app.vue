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
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
