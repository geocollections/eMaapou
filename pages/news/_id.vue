<template>
  <div style="max-width: 800px" class="mx-auto">
    <v-row no-gutters>
      <v-col class="my-4">
        <div class="text-right montserrat pr-4 text--secondary">
          {{ $formatDate(news.date_added) }}
        </div>
        <base-header
          :title="$translate({ et: news.title_et, en: news.title_en })"
        />
      </v-col>
    </v-row>
    <v-row no-gutters justify="center">
      <v-col>
        <div
          class="text-body-1"
          v-html="$translate({ et: news.text_et, en: news.text_en })"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: { BaseHeader },
  layout: 'news',
  async asyncData({ params, $services }) {
    const newsResponse = await $services.sarvREST.getResource(
      'web_news',
      params.id
    )

    return {
      news: newsResponse,
    }
  },
  head() {
    return {
      title: `${this.title} | ${this.$t('news.pageTitle')}}`,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: `${this.title} | ${this.$t('news.pageTitle')}}`,
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
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
