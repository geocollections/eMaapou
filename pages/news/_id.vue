<template>
  <v-row>
    <v-col>
      <title-card
        :title="$translate({ et: news.title_et, en: news.title_en })"
        class="title-border"
        style="border-color: var(--v-header-darken1)"
      />
      <div v-html="$translate({ et: news.text_et, en: news.text_en })"></div>
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
}
</script>
