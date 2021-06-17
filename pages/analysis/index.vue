<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.analysesCount')"
        icon="mdi-chart-scatter-plot"
        class="title-analysis"
      />
    </template>

    <template #form>
      <analysis-search-form />
    </template>

    <template #result>
      <div class="text-h6 pl-2 py-1">
        {{ count ? $tc('common.count', count) : '' }}
      </div>
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
import AnalysisSearchForm from '~/components/search/forms/AnalysisSearchForm.vue'
import Search from '~/components/templates/Search'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'
import TitleCard from '~/components/TitleCard.vue'

export default {
  name: 'AnalysisSearch',
  components: {
    Search,
    AnalysisSearchForm,
    AnalysisTable,
    TitleCard,
  },
  mixins: [dynamicTableHeaders],
  head() {
    return {
      title: this.$t('analysis.pageTitle'),
      meta: [
        {
          property: 'og:title',
          content: this.$t('analysis.pageTitle'),
          hid: 'og:title',
        },
      ],
    }
  },
  computed: {
    ...mapState('search/analysis', ['items', 'count', 'options']),
  },
  methods: {
    ...mapActions('search/analysis', ['searchAnalyses']),
    async handleUpdate(tableState) {
      await this.searchAnalyses(tableState?.options)
    },
  },
}
</script>
