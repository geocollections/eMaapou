<script setup lang="ts">
const page = ref(1);
const newsList = ref<any[]>([]);
const complete = ref(false);
const loading = ref(false);

const localePath = useLocalePath();
const { $apiFetch } = useNuxtApp();

async function infiniteHandler(isIntersecting: boolean) {
  if (!isIntersecting)
    return;
  if (complete.value)
    return;

  loading.value = true;

  const res = await $apiFetch<GeoloogiaListResponse>("/web-news/", {
    query: {
      offset: (page.value - 1) * 5,
      limit: 5,
      ordering: "-date_added",
    },
  });

  if (!res.next) {
    newsList.value.push(...res.results);
    loading.value = false;
    complete.value = true;
  }
  else {
    page.value += 1;
    newsList.value.push(...res.results);
    loading.value = false;
  }
};

const { t } = useI18n();

await infiniteHandler(true);

useHead({
  title: t("news.pageTitle"),
});
</script>

<template>
  <VMain>
    <VContainer
      class="pt-1 pb-10 mx-auto"
      style="min-height: 100vh; max-width: 800px;"
      :fluid="$vuetify.display.lgAndDown"
    >
      <BaseHeader class="py-4" :title="$t('common.news')" />
      <div class="d-flex flex-column pa-0">
        <NewsPreviewCard
          v-for="(news, i) in newsList"
          :key="i"
          :preview-lenght="500"
          :date="news.date_published"
          :title="$translate({ et: news.title_et, en: news.title_en })"
          :content="$translate({ et: news.text_et, en: news.text_en })"
          :to="localePath({ name: 'news-id', params: { id: news.id } })"
        />
      </div>
      <div v-intersect="infiniteHandler" />
    </VContainer>
  </VMain>
</template>
