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
      <search-view-map-wrapper
        site-overlay
        :items="items"
        class="mb-6 mt-2"
        @update="handleUpdate"
      />
    </template>

    <template #result>
      <div class="text-h6 pt-1 py-1">
        {{ count ? $tc('common.count', count) : '' }}
      </div>
      <site-table
        :show-search="false"
        :items="items"
        :count="count"
        :options="options"
        use-dynamic-headers
        @update="handleUpdate"
      />
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SiteSearchForm from '@/components/search/forms/SiteSearchForm'
import SiteTable from '~/components/tables/SiteTable.vue'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import Search from '~/components/templates/Search'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    SearchViewMapWrapper,
    SiteSearchForm,
    SiteTable,
    TitleCard,
  },
  mixins: [dynamicTableHeaders],
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
    ...mapState('landing', ['search']),
    ...mapState('site', ['options', 'items', 'count']),
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
    ...mapActions('site', ['searchSites']),
    async handleUpdate(tableState) {
      await this.searchSites(tableState?.options)
    },
  },
}
</script>
