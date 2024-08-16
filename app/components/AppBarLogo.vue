<script setup lang="ts">
const localePath = useLocalePath();

const logo = "/logos/emaapou5white.svg";
</script>

<template>
  <NuxtLink
    class="logo-link"
    :aria-label="$t('landing.alt')"
    :to="localePath({ path: '/' })"
  >
    <NuxtImg
      contain
      class="px-0 px-sm-3"
      style="vertical-align: middle;"
      :alt="$t('logo.alt')"
      :height="32"
      :src="logo"
    />
  </NuxtLink>
</template>

<style scoped lang="css">
.logo-link {
  height: 48px;
  display: contents;
}
.logo-link::before {
  content: "";
  height: 48px;
  width: 104px;
  position: absolute;
  opacity: 0;
  color: #ffffff;
  background-color: currentColor;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);
}
.logo-link:hover::before {
  opacity: 0.08;
}
</style>
