<script setup lang="ts">
const { data: page } = await useApiFetch<any>("/web-pages/63/");

const { $translate } = useNuxtApp();

useHead({
  title: $translate({
    et: page.value.title_et,
    en: page.value.title_en,
  }),
});
</script>

<template>
  <VMain>
    <VContainer style="max-width: 800px" class="mx-auto">
      <VRow no-gutters>
        <VCol class="pl-4" cols="12">
          <BaseHeader
            class="mb-4"
            :title="$translate({ et: page.title_et, en: page.title_en })"
          />
          <VCard
            v-if="page"
            width=""
            tile
            flat
            color="transparent"
          >
            <div
              class="mx-3 aboutpage"
              v-html="$translate({ et: page.content_et, en: page.content_en })"
            />
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </VMain>
</template>

<style scoped>
.aboutpage :deep(p) {
  margin-bottom: 1rem;
}
</style>
