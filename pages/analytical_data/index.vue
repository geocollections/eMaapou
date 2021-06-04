<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.analyticalDataCount')"
        :subtitle="$t('common.count', { count: count })"
        icon="mdi-chart-scatter-plot"
        class="title-analysis"
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
        @update="handleUpdate"
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
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import AnalyticalDataTable from '~/components/tables/AnalyticalDataTable'
import AnalyticalDataSearchForm from '~/components/search/forms/AnalyticalDataSearchForm'
import Search from '~/components/templates/Search'
import TitleCard from '~/components/TitleCard.vue'

export default {
  name: 'AnalysisSearch',
  components: {
    Search,
    AnalyticalDataSearchForm,
    AnalyticalDataTable,
    SearchViewMapWrapper,
    TitleCard,
  },
  head() {
    return {
      title: this.$t('analyticalData.pageTitle'),
      meta: [
        {
          property: 'og:title',
          content: this.$t('analyticalData.pageTitle'),
          hid: 'og:title',
        },
      ],
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('analyticalData', ['items', 'count', 'options']),
  },
  methods: {
    ...mapActions('analyticalData', ['searchAnalyticalData']),
    async handleUpdate(tableState) {
      await this.searchAnalyticalData(tableState?.options)
    },
  },
}
</script>
