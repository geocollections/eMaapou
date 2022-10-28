<template>
  <search>
    <template #title>
      <base-header
        :title="$t('analyticalData.pageTitle')"
        :icon="icons.mdiChartLine"
      />
    </template>

    <template #form>
      <search-form-analytical-data
        @update="handleFormUpdate"
        @reset="handleFormReset"
      />
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
          @update="handleDataTableUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script lang="ts">
import { mdiChartLine } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import isEqual from 'lodash/isEqual'
import DataTableAnalyticalData from '~/components/data-table/DataTableAnalyticalData.vue'
import SearchFormAnalyticalData from '~/components/search/forms/SearchFormAnalyticalData.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_ANALYTICAL_DATA } from '~/constants/headers'

import parseQueryParams from '~/utils/parseQueryParams'
import getQueryParams from '~/utils/getQueryParams'
const qParamKey = 'analyticalDataQ'

export default Vue.extend({
  name: 'AnalysisSearch',
  components: {
    Search,
    SearchFormAnalyticalData,
    DataTableAnalyticalData,
    BaseHeader,
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList(
      'analytical_data',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_ANALYTICAL_DATA),
        searchFilters: {
          ...this.$accessor.search.analytical_data.filters.byIds,
          ...this.$accessor.search.globalFilters.byIds,
          ...this.$accessor.search.analytical_data.parameterFilters.byIds,
        },
      }
    )
    this.items = response.items
    this.count = response.count
  },
  head(): MetaInfo {
    return {
      title: this.$t('analyticalData.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          content: this.$t('analyticalData.pageTitle') as string,
          hid: 'og:title',
        },
      ],
    }
  },
  computed: {
    ...mapFields('search/analytical_data', {
      query: 'query',

      items: 'items',
      count: 'count',
      options: 'options',
      locality: 'filters.byIds.locality.value',
      depth: 'filters.byIds.depth.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      lithostratigraphy: 'filters.byIds.lithostratigraphy.value',
      analysis: 'filters.byIds.analysis.value',
      method: 'filters.byIds.method.value',
      lab: 'filters.byIds.lab.value',
      agentAnalysed: 'filters.byIds.agentAnalysed.value',
      reference: 'filters.byIds.reference.value',
      dataset: 'filters.byIds.dataset.value',
      stratigraphyBed: 'filters.byIds.stratigraphyBed.value',
      rock: 'filters.byIds.rock.value',
      sample: 'filters.byIds.sample.value',
      project: 'filters.byIds.project.value',
    }),
    ...mapFields('search', {
      geoJSON: 'globalFilters.byIds.geoJSON.value',
      institutions: 'globalFilters.byIds.institutions.value',
    }),
    icons(): any {
      return {
        mdiChartLine,
      }
    },
  },
  watch: {
    '$route.query': {
      async handler() {
        await this.$accessor.search.resetFilters('analytical_data')
        this.setStateFromQueryParams()
        this.$fetch()
      },
    },
  },
  created() {
    // Add global filters and table options to query params, if they are missing
    const query = getQueryParams({
      globalFilters: this.$accessor.search.globalFilters.byIds,
      // @ts-ignore
      tableOptions: this.options,
    })
    if (!isEqual({ ...query, ...this.$route.query }, this.$route.query))
      this.$router.replace({ query: { ...query, ...this.$route.query } })

    this.setStateFromQueryParams()
  },
  methods: {
    setStateFromQueryParams() {
      const parsedValues = parseQueryParams({
        route: this.$route,
        filters: this.$accessor.search.analytical_data.filters.byIds,
        globalFilters: this.$accessor.search.globalFilters.byIds,
        qKey: qParamKey,
      })
      this.query = parsedValues.query
      if (parsedValues.filters) {
        Object.keys(parsedValues.filters).forEach((key) => {
          // @ts-ignore
          this[key] = parsedValues.filters?.[key]
        })
      }
      if (parsedValues.globalFilters) {
        Object.keys(parsedValues.globalFilters).forEach((key) => {
          // @ts-ignore
          this[key] = parsedValues.globalFilters?.[key]
        })
      }
      this.options = {
        ...this.options,
        ...parsedValues.options,
      }
    },
    async handleFormReset() {
      this.options.page = 1

      // NOTE: https://github.com/nuxt/nuxt.js/issues/6951#issuecomment-904655674
      await new Promise((resolve, reject) =>
        this.$router.push(
          { path: this.$route.path, query: {} },
          resolve,
          reject
        )
      )
      await this.$accessor.search.resetFilters('analytical_data')
      this.$fetch()
    },
    async handleFormUpdate() {
      this.options.page = 1
      const query = getQueryParams({
        q: {
          key: qParamKey,
          value: this.$accessor.search.analytical_data.query,
        },
        filters: this.$accessor.search.analytical_data.filters.byIds,
        globalFilters: this.$accessor.search.globalFilters.byIds,
        tableOptions: this.options,
      })
      await new Promise((resolve, reject) =>
        this.$router.push({ query }, resolve, reject)
      )
      this.$fetch()
    },
    async handleDataTableUpdate(tableState: any) {
      this.options = tableState.options
      const query = getQueryParams({
        q: {
          key: qParamKey,
          value: this.$accessor.search.analytical_data.query,
        },

        filters: this.$accessor.search.analytical_data.filters.byIds,
        globalFilters: this.$accessor.search.globalFilters.byIds,
        tableOptions: this.options,
      })
      await new Promise((resolve, reject) =>
        this.$router.push({ query }, resolve, reject)
      )
      this.$fetch()
    },
  },
})
</script>
