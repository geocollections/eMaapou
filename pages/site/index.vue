<template>
  <search>
    <template #title>
      <page-title-wrapper
        :title="$t('common.sitesCount')"
        :count="count"
        icon="mdi-map-marker-star-outline"
      />
    </template>

    <template #form>
      <site-search-form />
    </template>

    <template #result>
      <search-view-map-wrapper site-overlay :items="items" class="mb-6" />

      <site-table
        :show-search="false"
        :items="items"
        :count="count"
        :options="options"
        @update="handleUpdate"
      />
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SiteSearchForm from '@/components/search/forms/SiteSearchForm'
import SiteTable from '~/components/tables/SiteTable.vue'
import PageTitleWrapper from '~/components/search/PageTitleWrapper'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import Search from '~/components/templates/Search'

export default {
  components: {
    Search,
    SearchViewMapWrapper,
    PageTitleWrapper,
    SiteSearchForm,
    SiteTable,
  },
  head() {
    return {
      title: this.$t('site.pageTitle'),
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
      await this.searchSites(tableState.options)
    },
  },
}
</script>
