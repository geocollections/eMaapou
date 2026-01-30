<script setup lang="ts">
const route = useRoute();
const { $translate, $formatDate } = useNuxtApp();
const localePath = useLocalePath();
const { data: news } = await useApiFetch<any>(`/web-news/${route.params.id}`);

const title = computed(() => {
  return $translate({ et: news.value?.title_et, en: news.value?.title_en });
});

const { t } = useI18n();

useHead({
  title: `${title.value} | ${t("news.pageTitle")}`,
});

const OTHER_NEWS_LIMIT = 6;

const { data: otherNewsList } = await useApiFetch<any>("/web-news/", {
  query: {
    limit: OTHER_NEWS_LIMIT,
    ordering: "-date_added",
  },
});

const filteredOtherNewsList = computed(() => {
  return otherNewsList.value.results.filter((news: any) => {
    return news.id !== Number(route.params.id);
  }).slice(0, OTHER_NEWS_LIMIT - 1);
});
</script>

<template>
  <VMain>
    <VContainer style="max-width: 800px; min-height: 100vh">
      <VRow no-gutters>
        <VCol class="my-4">
          <div class="text-right montserrat pr-4 text--secondary">
            {{ $formatDate(news.date_published) }}
          </div>
          <div class="text-h4">
            {{ $translate({ et: news.title_et, en: news.title_en }) }}
          </div>
        </VCol>
      </VRow>
      <VRow no-gutters justify="center">
        <VCol>
          <div
            class="text-body-1 news-text"
            v-html="$translate({ et: news.text_et, en: news.text_en })"
          />
        </VCol>
      </VRow>
      <VDivider />
      <BaseHeader :title="$t('common.otherNewsList')" class="pt-6 pb-2 title-heading" />
      <div class="d-flex flex-column pa-0">
        <NewsPreviewCard
          v-for="(otherNews, i) in filteredOtherNewsList"
          :key="i"
          class="mb-2"
          :preview-lenght="400"
          :date="otherNews.date_published"
          :title="$translate({ et: otherNews.title_et, en: otherNews.title_en })"
          :content="$translate({ et: otherNews.text_et, en: otherNews.text_en })"
          :to="localePath({ name: 'news-id', params: { id: otherNews.id } })"
        />
      </div>
      <div>
        <VSpacer />
        <VBtn
          nuxt
          color="accent"
          class="montserrat text-none"
          :to="localePath('news')"
          variant="text"
        >
          {{ $t("common.viewNews") }}
        </VBtn>
      </div>
    </VContainer>
    <AppFooter />
  </VMain>
</template>

<style scoped>
:deep(p) {
  margin-bottom: 16px
}

.news-text {
  list-style-position: inside;
}
</style>
