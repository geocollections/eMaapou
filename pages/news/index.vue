<template>
  <div>
    <v-row>
      <v-col>
        <title-card
          :title="$t('common.news')"
          class="title-heading"
        ></title-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col lg="7" md="8" cols="12" class="pl-4">
        <div v-for="(news, i) in newsList" :key="`landing-news-${news.id}`">
          <news-preview-card
            :preview-lenght="400"
            :date="news.date_added"
            :title="$translate({ et: news.title_et, en: news.title_en })"
            :content="$translate({ et: news.text_et, en: news.text_en })"
            @click="openNews(news)"
          >
          </news-preview-card>
          <v-divider v-if="i !== newsList.length - 1" class="my-5" />
        </div>
        <client-only>
          <infinite-loading ref="infiniteLoading" @infinite="infiniteHandler">
            <template #spinner>
              <v-progress-circular color="primary darken-2" indeterminate />
            </template>
            <template #no-more>{{ $t('infinite.noMore') }}</template>
            <template #error="{ trigger }">
              <div>
                {{ $t('infinite.error') }}
              </div>
              <br />
              <v-btn outlined color="primary darken-2" @click="trigger">
                {{ $t('infinite.retry') }}
              </v-btn>
            </template>
          </infinite-loading>
        </client-only>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import NewsPreviewCard from '~/components/NewsPreviewCard.vue'
import TitleCard from '~/components/TitleCard.vue'
export default {
  components: {
    TitleCard,
    NewsPreviewCard,
  },
  data() {
    return {
      page: 1,
      newsList: [],
    }
  },

  head() {
    return {
      title: this.$t('news.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('news.pageTitle'),
        },
      ],
    }
  },
  methods: {
    infiniteHandler($state) {
      this.$services.sarvREST
        .getResourceList('web_news', {
          options: {
            page: this.page,
            itemsPerPage: 5,
            sortBy: ['date_added'],
            sortDesc: [true],
          },
          queryFields: { date_added: 'date_added' },
        })
        .then((res) => {
          if (!res.next) {
            this.newsList.push(...res.items)

            $state.loaded()
            $state.complete()
          } else {
            this.page += 1
            this.newsList.push(...res.items)
            $state.loaded()
          }
        })
        .catch((e) => {
          $state.error()
        })
    },
    openNews(news) {
      this.$router.push(
        this.localePath({ name: 'news-id', params: { id: news.id } })
      )
    },
  },
}
</script>
