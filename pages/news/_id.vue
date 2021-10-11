<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <div class="text-right montserrat pr-4">
          {{ $formatDate(news.date_added) }}
        </div>
        <title-card
          :title="$translate({ et: news.title_et, en: news.title_en })"
          class="title-heading"
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
  async asyncData({
    params,
    route,
    redirect,
    $services,
    $translate,
    $createSlugRoute,
  }) {
    const newsResponse = await $services.sarvREST.getResource(
      'web_news',
      params.id
    )

    return {
      news: newsResponse,
    }
  },
  async fetch() {
    const text = this.$translate({
      et: this.newsResponse.title_et,
      en: this.newsResponse.title_en,
    })

    const slugRoute = this.$createSlugRoute(this.$route, text)
    if (slugRoute.path !== this.$route.path)
      await this.$router.replace(slugRoute.path)
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
