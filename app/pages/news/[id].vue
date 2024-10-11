<script setup lang="ts">
const route = useRoute();
const { $translate, $formatDate } = useNuxtApp();
const { data: news } = await useGeoloogiaApiFetch<any>(`/web_news/${route.params.id}`);

const title = computed(() => {
  return $translate({ et: news.value?.title_et, en: news.value?.title_en });
});

const { t } = useI18n();

useHead({
  title: `${title.value} | ${t("news.pageTitle")}`,
});
</script>

<template>
  <main>
    <div style="max-width: 800px">
      <div no-gutters>
        <div class="my-4">
          <div class="text-right montserrat pr-4 text--secondary">
            {{ $formatDate(news.date_added) }}
          </div>
          <div class="text-h4">
            {{ $translate({ et: news.title_et, en: news.title_en }) }}
          </div>
        </div>
      </div>
      <div no-gutters justify="center">
        <div>
          <div
            class="text-body-1"
            v-html="$translate({ et: news.text_et, en: news.text_en })"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
:deep(p) {
  margin-bottom: 16px
}
</style>
