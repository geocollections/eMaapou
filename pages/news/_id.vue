<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <div class="text-right montserrat pr-4">
          {{ $formatDate(news.date_added) }}
        </div>
        <title-card
          :title="$translate({ et: news.title_et, en: news.title_en })"
          class="title-border"
          style="border-color: var(--v-header-darken1)"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col class="pl-4" cols="12" md="8" lg="6">
        <div v-html="$translate({ et: news.text_et, en: news.text_en })" />
      </v-col>
    </v-row>
  </div>
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

  head() {
    return {
      title: this.title,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.title,
        },
      ],
    }
  },
  computed: {
    title() {
      return this.$translate({ et: this.news.title_et, en: this.news.title_en })
    },
  },
}
</script>
