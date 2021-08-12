<template>
  <v-row justify="center">
    <v-col cols="12" md="8" lg="6">
      <div class="text-right montserrat">{{ formatDate(news.date_added) }}</div>
      <title-card
        :title="$translate({ et: news.title_et, en: news.title_en })"
        class="title-border"
        style="border-color: var(--v-header-darken1)"
      />
      <div
        class="montserrat"
        v-html="$translate({ et: news.text_et, en: news.text_en })"
      />
    </v-col>
  </v-row>
</template>

<script>
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: { TitleCard },
  async asyncData({ params, app }) {
    const newsResponse = await app.$services.sarvREST.getResource(
      'webnews',
      params.id
    )

    return {
      news: newsResponse.results[0],
    }
  },
  methods: {
    formatDate(isoDateTime) {
      return new Date(isoDateTime).toISOString().split('T')[0]
    },
  },
}
</script>
