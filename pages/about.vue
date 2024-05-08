<script setup lang="ts">
const { data: page } = await useGeoloogiaApiFetch<any>("/web_pages/78/");

const { t } = useI18n();
const { $translate } = useNuxtApp();

useHead({
  title: t("about.pageTitle"),
});
</script>

<template>
  <VMain>
    <div class="pt-5 mx-auto" style="max-width: 800px">
      <BaseHeader
        :title="$t('about.title')"
        class="mb-2 mx-3"
        style="border-color: var(--v-header-darken1)"
      />
      <VCard
        v-if="page"
        width="100%"
        tile
        flat
        color="transparent"
        class="roundedBorder"
      >
        <div
          class="mx-6 text-body-1"
          style="max-width: 700px"
          v-html="$translate({ et: page.content_et, en: page.content_en })"
        />
      </VCard>
    </div>
  </VMain>
</template>

<style scoped>
.aboutpage {
  padding: 20px;
  /* border-top: solid 1px #6a76ab;
  border-bottom: solid 1px #6a76ab; */
}

.aboutpage > div {
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}
</style>
