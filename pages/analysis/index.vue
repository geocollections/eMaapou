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
import DataTableAnalysis from '~/components/data-table/DataTableAnalysis.vue'
import SearchFormAnalysis from '~/components/search/forms/SearchFormAnalysis.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import isFilterValid from '~/utils/isFilterValid'
import { FilterType } from '~/types/enums'
import { Filter } from '~/types/filters'
import { IOptions } from '~/services'
import { ANALYSIS, HEADERS_ANALYSIS } from '~/constants'
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
  data() {
    return {
      options: ANALYSIS.options,
      items: [],
      count: 0,
    }
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
      // options: 'options',
      id: 'filters.byIds.id.value',
      query: 'query',
      depth: 'filters.byIds.depth.value',
    }),
  },
  watch: {
    '$route.query': {
      async handler() {
        await this.setStateFromQueryParams()
        this.$fetch()
      },
    },
  },
  created() {
    this.setStateFromQueryParams()
  },
  methods: {
    async setStateFromQueryParams() {
      await this.$accessor.search.resetModuleFilters('analysis')
      const parsedValues = parseQueryParams(
        this.$route,
        this.$accessor.search.analysis.filters.byIds,
        qParamKey
      )
      this.query = parsedValues.query
      if (parsedValues.filters) {
        Object.keys(parsedValues.filters).forEach((key) => {
          // @ts-ignore
          this[key] = parsedValues.filters?.[key]
        })
      }
      this.options = {
        ...this.options,
        ...parsedValues.options,
      }
    },
    getQueryParams({
      q,
      qKey,
      filters,
      tableOptions,
    }: {
      q: string
      qKey: string
      filters: { [K: string]: Filter }
      tableOptions: IOptions
    }) {
      const query: { [K: string]: any | any[] } = {}

      if (q.length > 0) {
        query[qKey] = q
      }
      Object.entries(filters)
        .filter(([_, filter]) => isFilterValid(filter))
        .forEach(([key, filter]) => {
          if (filter.type === FilterType.Text) query[key] = filter.value
          else if (filter.type === FilterType.Range) {
            const start = filter.value[0] ?? '*'
            const end = filter.value[1] ?? '*'
            query[key] = `${start}-${end}`
          }
        })
      query.page = tableOptions.page.toString()
      query.itemsPerPage = tableOptions.itemsPerPage.toString()
      query.sortBy = tableOptions.sortBy
      query.sortDesc = tableOptions.sortDesc
      return query
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
        q: this.$accessor.search.analysis.query,
        qKey: qParamKey,
        filters: this.$accessor.search.analysis.filters.byIds,
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
        q: this.$accessor.search.analysis.query,
        qKey: qParamKey,
        filters: this.$accessor.search.analysis.filters.byIds,
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
