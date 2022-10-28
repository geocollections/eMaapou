<template>
  <search>
    <template #title>
      <base-header :title="$t('analysis.pageTitle')" />
    </template>

    <template #form>
      <search-form-analysis
        @update="handleFormUpdate"
        @reset="handleFormReset"
      />
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
          :is-loading="$fetchState.pending"
          @update="handleDataTableUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script lang="ts">
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import isEqual from 'lodash/isEqual'
import DataTableAnalysis from '~/components/data-table/DataTableAnalysis.vue'
import SearchFormAnalysis from '~/components/search/forms/SearchFormAnalysis.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_ANALYSIS } from '~/constants'
import parseQueryParams from '~/utils/parseQueryParams'
import getQueryParams from '~/utils/getQueryParams'
const qParamKey = 'analysisQ'

export default Vue.extend({
  name: 'AnalysisSearch',
  components: {
    Search,
    SearchFormAnalysis,
    DataTableAnalysis,
    BaseHeader,
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList('analysis', {
      options: this.options,
      search: this.query,
      fields: this.$getAPIFieldValues(HEADERS_ANALYSIS),
      searchFilters: {
        ...this.$accessor.search.analysis.filters.byIds,
        ...this.$accessor.search.globalFilters.byIds,
      },
    })
    this.items = response.items
    this.count = response.count
  },
  head(): MetaInfo {
    return {
      title: this.$t('analysis.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          content: this.$t('analysis.pageTitle') as string,
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
    ...mapFields('search/analysis', {
      query: 'query',
      items: 'items',
      count: 'count',
      options: 'options',
      id: 'filters.byIds.id.value',
      depth: 'filters.byIds.depth.value',
    }),
    ...mapFields('search', {
      geoJSON: 'globalFilters.byIds.geoJSON.value',
      institutions: 'globalFilters.byIds.institutions.value',
    }),
  },
  watch: {
    '$route.query': {
      async handler() {
        await this.$accessor.search.resetFilters('analysis')
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
      // await this.$accessor.search.resetModuleFilters('analysis')
      const parsedValues = parseQueryParams({
        route: this.$route,
        filters: this.$accessor.search.analysis.filters.byIds,
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
      await this.$accessor.search.resetFilters('analysis')
      this.$fetch()
    },
    async handleFormUpdate() {
      this.options.page = 1
      const query = getQueryParams({
        q: { key: qParamKey, value: this.$accessor.search.analysis.query },
        filters: this.$accessor.search.analysis.filters.byIds,
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
        q: { key: qParamKey, value: this.$accessor.search.analysis.query },
        filters: this.$accessor.search.analysis.filters.byIds,
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
