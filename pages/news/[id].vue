<script setup lang="ts">
const route = useRoute();
const { $translate, $formatDate } = useNuxtApp();
const { data: news } = await useGeoloogiaApiFetch(`/web_news/${route.params.id}`);

const title = computed(() => {
  return $translate({ et: news.value?.title_et, en: news.value?.title_en });
});

const { t } = useI18n();

useHead({
  title: `${title.value} | ${t("news.pageTitle")}`,
});
</script>

<template>
  <VMain>
    <VContainer style="max-width: 800px">
      <VRow no-gutters>
        <VCol class="my-4">
          <div class="text-right montserrat pr-4 text--secondary">
            {{ $formatDate(news.date_added) }}
          </div>
          <div class="text-h4">
            {{ $translate({ et: news.title_et, en: news.title_en }) }}
          </div>
        </VCol>
      </VRow>
      <VRow no-gutters justify="center">
        <VCol>
          <div
            class="text-body-1"
            v-html="$translate({ et: news.text_et, en: news.text_en })"
          />
        </VCol>
      </VRow>
      <VContainer>
        <VMain />
      </vcontainer>
    </vcontainer>
  </vmain>
</template>

<style scoped>
:deep(p) {
  margin-bottom: 16px
}
</style>
