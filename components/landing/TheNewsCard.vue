<template>
  <v-card flat color="transparent">
    <v-row no-gutters>
      <v-col>
        <title-card :title="$t('common.news')" class="title-heading" />
        <v-card-text class="d-flex flex-column">
          <div v-for="(news, i) in newsList" :key="`landing-news-${news.id}`">
            <news-preview-card
              :preview-lenght="previewLength"
              :date="news.date_added"
              :title="$translate({ et: news.title_et, en: news.title_en })"
              :content="$translate({ et: news.text_et, en: news.text_en })"
              @click="openNews(news)"
            >
            </news-preview-card>
            <v-divider v-if="i !== newsList.length - 1" class="my-5" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn nuxt class="montserrat" :to="localePath('news')" text>{{
            $t('common.viewNews')
          }}</v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import NewsPreviewCard from '~/components/NewsPreviewCard.vue'
import TitleCard from '~/components/TitleCard.vue'
export default {
  name: 'TheNewsSection',
  components: { NewsPreviewCard, TitleCard },
  data() {
    return {
      newsList: [],
    }
  },
  async fetch() {
    const newsResponse = await this.$services.sarvREST.getResourceList(
      'web_news',
      {
        options: {
          page: 1,
          itemsPerPage: 2,
          sortBy: ['date_added'],
          sortDesc: [true],
        },
        queryFields: { date_added: 'date_added' },
      }
    )
    this.newsList = newsResponse.items
  },
  computed: {
    previewLength() {
      if (this.$vuetify.breakpoint.lgAndUp) return 200
      return 140
    },
  },
  methods: {
    openNews(news) {
      this.$router.push(
        this.localePath({ name: 'news-id', params: { id: news.id } })
      )
    },
  },
}
</script>
