<script setup lang="ts">
const { $translate } = useNuxtApp();
const localePath = useLocalePath();

const { data: newsList } = await useNewApiFetch<any>("/web-news/", {
  query: {
    limit: 6,
    ordering: "-date_added",
  },
});
</script>

<template>
  <div>
    <BaseHeader :title="$t('common.news')" class="pb-2 title-heading" />
    <div class="d-flex flex-column pa-0">
      <NewsPreviewCard
        v-for="(news, i) in newsList.results"
        :key="i"
        class="mb-2"
        :preview-lenght="400"
        :date="news.date_added"
        :title="$translate({ et: news.title_et, en: news.title_en })"
        :content="$translate({ et: news.text_et, en: news.text_en })"
        :to="localePath({ name: 'news-id', params: { id: news.id } })"
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
  </div>
</template>
