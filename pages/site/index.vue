<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.sitesCount')"
        icon="mdi-map-marker-star-outline"
        class="title-site"
      />
    </template>

    <template #form>
      <site-search-form />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <site-table
        :show-search="false"
        :items="items"
        :count="count"
        :options="options"
        dynamic-headers
        stateful-headers
        @update="handleUpdate"
      />
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SiteSearchForm from '@/components/search/forms/SiteSearchForm'
import SiteTable from '~/components/tables/SiteTable.vue'
import Search from '~/components/templates/Search'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    SiteSearchForm,
    SiteTable,
    TitleCard,
  },
  head() {
    return {
      title: this.$t('site.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('site.pageTitle'),
        },
      ],
    }
  },
  computed: {
    ...mapState('search/site', ['options', 'items', 'count']),
    translatedHeaders() {
      return this.headers.map((header) => {
        return {
          ...header,
          text: this.$t(header.text),
        }
      })
    },
  },
  methods: {
    ...mapActions('search/site', ['searchSites']),
    async handleUpdate(tableState) {
      await this.searchSites(tableState?.options)
    },
  },
}
</script>
