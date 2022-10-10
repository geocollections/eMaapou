<template>
  <search>
    <template #title>
      <base-header :title="$t('analysis.pageTitle')" />
    </template>

    <template #form>
      <search-form-analysis />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <v-card>
        <data-table-analysis
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          stateful-headers
          dynamic-headers
          @update="handleUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DataTableAnalysis from '~/components/data-table/DataTableAnalysis.vue'
import SearchFormAnalysis from '~/components/search/forms/SearchFormAnalysis.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  name: 'AnalysisSearch',
  components: {
    Search,
    SearchFormAnalysis,
    DataTableAnalysis,
    BaseHeader,
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
