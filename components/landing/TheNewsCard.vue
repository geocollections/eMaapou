<template>
  <v-card flat color="transparent">
    <v-row no-gutters>
      <v-col>
        <base-header :title="$t('common.news')" class="title-heading" />
        <v-card-text class="d-flex flex-column pa-0">
          <news-preview-card
            v-for="(news, i) in newsList"
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
            text
            >{{ $t('common.viewNews') }}</v-btn
          >
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import NewsPreviewCard from '~/components/NewsPreviewCard.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
export default {
  name: 'TheNewsSection',
  components: { NewsPreviewCard, BaseHeader },
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
          itemsPerPage: 6,
          sortBy: ['date_added'],
          sortDesc: [true],
        },
        fields: { date_added: 'date_added' },
      }
    )
    this.newsList = newsResponse.items
  },
  computed: {
    previewLength() {
      if (this.$vuetify.breakpoint.lgAndUp) return 400
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
