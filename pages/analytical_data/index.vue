<template>
  <search>
    <template #title>
      <page-title-wrapper
        :title="$t('common.analyticalDataCount')"
        :count="count"
        icon="mdi-chart-scatter-plot"
      />
    </template>

    <template #form>
      <analytical-data-search-form />
    </template>

    <template #result>
      <search-view-map-wrapper
        site-overlay
        locality-overlay
        :items="items"
        class="mb-6"
      />
      <analytical-data-table
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
import PageTitleWrapper from '~/components/search/PageTitleWrapper'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import AnalyticalDataTable from '~/components/tables/AnalyticalDataTable'
import AnalyticalDataSearchForm from '~/components/search/forms/AnalyticalDataSearchForm'
import Search from '~/components/templates/Search'

export default {
  name: 'AnalysisSearch',
  components: {
    Search,
    AnalyticalDataSearchForm,
    AnalyticalDataTable,
    SearchViewMapWrapper,
    PageTitleWrapper,
  },
  head() {
    return {
      title: this.$t('analyticalData.pageTitle'),
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('analyticalData', ['items', 'count', 'options']),
  },
  methods: {
    ...mapActions('analyticalData', ['searchAnalyticalData']),
    async handleUpdate(tableState) {
      await this.searchAnalyticalData(tableState.options)
    },
  },
}
</script>
