<template>
  <search>
    <template #title>
      <page-title-wrapper
        :title="$t('common.analysesCount')"
        :count="count"
        icon="mdi-chart-scatter-plot"
      />
    </template>

    <template #form>
      <analysis-search-form />
    </template>

    <template #result>
      <search-view-map-wrapper :items="items" class="mb-6" />

      <analysis-table
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
import AnalysisTable from '@/components/tables/AnalysisTable'
import AnalysisSearchForm from '~/components/search/forms/AnalysisSearchForm'
import PageTitleWrapper from '~/components/search/PageTitleWrapper'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import Search from '~/components/templates/Search'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'

export default {
  name: 'AnalysisSearch',
  components: {
    Search,
    SearchViewMapWrapper,
    PageTitleWrapper,
    AnalysisSearchForm,
    AnalysisTable,
  },
  mixins: [dynamicTableHeaders],
  head() {
    return {
      title: this.$t('analysis.pageTitle'),
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('analysis', ['items', 'count', 'options']),
  },
  methods: {
    ...mapActions('analysis', ['searchAnalyses']),
    async handleUpdate(tableState) {
      await this.searchAnalyses(tableState.options)
    },
  },
}
</script>
