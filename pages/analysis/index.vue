<template>
  <search>
    <template #title>
      <title-card :title="$t('analysis.pageTitle')" class="title-analysis" />
    </template>

    <template #form>
      <search-form-analysis />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <data-table-analysis
        :show-search="false"
        :items="items"
        :count="count"
        :options="options"
        stateful-headers
        dynamic-headers
        @update="handleUpdate"
      />
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DataTableAnalysis from '~/components/data-table/DataTableAnalysis'
import SearchFormAnalysis from '~/components/search/forms/SearchFormAnalysis.vue'
import Search from '~/templates/Search'
import TitleCard from '~/components/TitleCard.vue'

export default {
  name: 'AnalysisSearch',
  components: {
    Search,
    SearchFormAnalysis,
    DataTableAnalysis,
    TitleCard,
  },
  head() {
    return {
      title: this.$t('analysis.pageTitle'),
      meta: [
        {
          property: 'og:title',
          content: this.$t('analysis.pageTitle'),
          hid: 'og:title',
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
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
