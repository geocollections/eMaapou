<template>
  <v-card
    style="background-color: rgba(0, 119, 154, 0.9)"
    class="ml-4"
    elevation="15"
  >
    <v-row no-gutters>
      <v-col>
        <div class="mt-4 mt-sm-7 mt-md-12">
          <v-card-title
            class="mx-3 mb-4 pa-0 px-sm-2 text-h5 text-sm-h4 white--text"
          >
            {{ $t('common.news') }}
          </v-card-title>
          <v-card-text class="d-flex flex-column">
            <div v-for="(news, i) in newsList" :key="`landing-news-${news.id}`">
              <news-preview-card
                :date="news.date_added"
                :title="$translate({ et: news.title_et, en: news.title_en })"
                :content="$translate({ et: news.text_et, en: news.text_en })"
                @click="openNews(news)"
              >
              </news-preview-card>
              <v-divider v-if="i !== newsList.length - 1" class="white my-5" />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn nuxt :to="localePath('news')" color="white" text>{{
              $t('common.viewNews')
            }}</v-btn>
          </v-card-actions>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import NewsPreviewCard from '~/components/NewsPreviewCard.vue'

export default {
  name: 'TheNewsSection',
  components: { NewsPreviewCard },
  data() {
    return {
      newsList: [],
    }
  },
  async fetch() {
    const newsResponse = await this.$services.sarvREST.getResourceList(
      'webnews',
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
  methods: {
    openNews(news) {
      this.$router.push(
        this.localePath({ name: 'news-id', params: { id: news.id } })
      )
    },
  },
}
</script>
