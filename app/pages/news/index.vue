<script setup lang="ts">
const page = ref(1);
const newsList = ref<any[]>([]);
const complete = ref(false);
const loading = ref(false);

const localePath = useLocalePath();
const { $geoloogiaFetch } = useNuxtApp();

async function infiniteHandler(isIntersecting: boolean) {
  if (!isIntersecting)
    return;
  if (complete.value)
    return;

  loading.value = true;

  const res = await $geoloogiaFetch<GeoloogiaListResponse>("/web_news/", {
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
  <main>
    <div
      class="pt-1 pb-10 mx-auto"
      style="min-height: 100vh; max-width: 800px;"
    >
      <div>
        <BaseHeader class="py-4" :title="$t('common.news')" />
        <div v-for="(news, i) in newsList" :key="i">
          <NewsPreviewCard
            :preview-lenght="500"
            :date="news.date_added"
            :title="$translate({ et: news.title_et, en: news.title_en })"
            :content="$translate({ et: news.text_et, en: news.text_en })"
            :to="localePath({ name: 'news-id', params: { id: news.id } })"
          />
          <div />
        </div>
        <!-- <div v-intersect="infiniteHandler" /> -->
      </div>
    </div>
  </main>
</template>
