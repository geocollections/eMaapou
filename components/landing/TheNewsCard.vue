<script setup lang="ts">
import { useDisplay } from "vuetify/lib/framework.mjs";

const { $translate } = useNuxtApp();
const router = useRouter();
const localePath = useLocalePath();
const { lgAndUp } = useDisplay();

const { data: newsList } = useApiFetch("/webnews", {
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
  <v-card flat color="transparent">
    <v-row no-gutters>
      <v-col>
        <base-header :title="$t('common.news')" class="pb-2 title-heading" />
        <v-card-text class="d-flex flex-column pa-0">
          <news-preview-card
            v-for="(news, i) in newsList.results"
            :key="i"
            class="mb-2"
            :preview-lenght="400"
            :date="news.date_added"
            :title="$translate({ et: news.title_et, en: news.title_en })"
            :content="$translate({ et: news.text_et, en: news.text_en })"
            @click="openNews(news)"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            nuxt
            color="accent"
            class="montserrat text-none"
            :to="localePath('news')"
            variant="text"
          >
            {{ $t("common.viewNews") }}
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>
