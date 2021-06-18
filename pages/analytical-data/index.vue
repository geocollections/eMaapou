<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.analyticalDataCount')"
        icon="mdi-chart-scatter-plot"
        class="title-analysis"
      />
    </template>

    <template #form>
      <analytical-data-search-form />
    </template>

    <template #result>
      <div class="text-h6 pl-2 py-1">
        {{ count ? $tc('common.count', count) : '' }}
      </div>
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
    ...mapState('search/analytical_data', ['items', 'count', 'options']),
  },
  methods: {
    ...mapActions('search/analytical_data', ['searchAnalyticalData']),
    handleUpdate(tableState) {
      this.searchAnalyticalData(tableState?.options)
    },
  },
}
</script>
