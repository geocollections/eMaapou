<template>
  <div class="pt-5">
    <base-header :title="$t('common.news')" />
    <!-- <v-btn @click="nextPage">next</v-btn> -->
    <client-only>
      <v-card elevation="0" color="transparent px-sm-3">
        <stack
          v-if="newsList.length > 0"
          ref="stacker"
          :column-min-width="400"
          :gutter-width="15"
          :gutter-height="15"
          monitor-images-loaded
        >
          <stack-item v-for="(news, i) in newsList" :key="i">
            <news-preview-card
              :preview-lenght="500"
              :date="news.date_added"
              :title="$translate({ et: news.title_et, en: news.title_en })"
              :content="$translate({ et: news.text_et, en: news.text_en })"
              @click="openNews(news)"
            />
          </stack-item>
        </stack>
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
      </v-card>
    </client-only>
  </div>
</template>

<script>
import NewsPreviewCard from '~/components/NewsPreviewCard.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
export default {
  components: {
    BaseHeader,
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
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
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
          fields: { date_added: 'date_added' },
        })
        .then((res) => {
          if (!res.next) {
            this.newsList.push(...res.items)
            setTimeout(() => {
              this.$refs.stacker.reflow()
            }, 50)

            $state.loaded()
            $state.complete()
          } else {
            this.page += 1
            this.newsList.push(...res.items)
            setTimeout(() => {
              this.$refs.stacker.reflow()
            }, 50)

            $state.loaded()
          }
        })
        .catch(() => {
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
