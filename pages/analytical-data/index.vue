<template>
  <search>
    <template #title>
      <base-header
        :title="$t('analyticalData.pageTitle')"
        :icon="icons.mdiChartLine"
      />
    </template>

    <template #form>
      <search-form-analytical-data />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-analytical-data
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          dynamic-headers
          stateful-headers
          :is-loading="$fetchState.pending"
          @update="handleUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script>
import { mdiChartLine } from '@mdi/js'
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import DataTableAnalyticalData from '~/components/data-table/DataTableAnalyticalData.vue'
import SearchFormAnalyticalData from '~/components/search/forms/SearchFormAnalyticalData.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  name: 'AnalysisSearch',
  components: {
    Search,
    SearchFormAnalyticalData,
    DataTableAnalyticalData,
    BaseHeader,
  },
  async fetch() {
    await this.searchAnalyticalData(this.options)
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
    ...mapState('search/analytical_data', ['items', 'count']),
    ...mapFields('search/analytical_data', ['options']),
    icons() {
      return {
        mdiChartLine,
      }
    },
  },
  methods: {
    ...mapActions('search/analytical_data', ['searchAnalyticalData']),
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
