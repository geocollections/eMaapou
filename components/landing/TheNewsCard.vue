<script setup lang="ts">
import { useDisplay } from "vuetify/lib/framework.mjs";

const { $translate } = useNuxtApp();
const router = useRouter();
const localePath = useLocalePath();
const { lgAndUp } = useDisplay();

const { data: newsList } = await useApiFetch("/webnews", {
  query: {
    limit: 6,
    order_by: "-date_added",
  },
});

const previewLength = computed(() => {
  if (lgAndUp)
    return 400;
  return 140;
});

function openNews(news) {
  router.push(localePath({ name: "news-id", params: { id: news.id } }));
}
</script>

<template>
  <VCard flat color="transparent">
    <VRow no-gutters>
      <VCol>
        <BaseHeader :title="$t('common.news')" class="pb-2 title-heading" />
        <VCardText class="d-flex flex-column pa-0">
          <NewsPreviewCard
            v-for="(news, i) in newsList.results"
            :key="i"
            class="mb-2"
            :preview-lenght="400"
            :date="news.date_added"
            :title="$translate({ et: news.title_et, en: news.title_en })"
            :content="$translate({ et: news.text_et, en: news.text_en })"
            @click="openNews(news)"
          />
        </VCardText>
        <VCardActions>
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
        </VCardActions>
      </VCol>
    </VRow>
  </VCard>
</template>
