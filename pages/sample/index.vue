<template>
  <search>
    <template #title>
      <base-header :title="$t('sample.pageTitle')" :icon="icons.mdiTestTube" />
    </template>

    <template #form>
      <search-form-sample @update="handleFormUpdate" @reset="handleFormReset" />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-sample
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
import { mdiTestTube } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import isEqual from 'lodash/isEqual'
import SearchFormSample from '~/components/search/forms/SearchFormSample.vue'
import DataTableSample from '~/components/data-table/DataTableSample.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import getQueryParams from '~/utils/getQueryParams'
import parseQueryParams from '~/utils/parseQueryParams'
import { HEADERS_SAMPLE } from '~/constants'
const qParamKey = 'sampleQ'
export default Vue.extend({
  components: {
    Search,
    SearchFormSample,
    DataTableSample,
    BaseHeader,
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList('sample', {
      options: this.options,
      search: this.query,
      fields: this.$getAPIFieldValues(HEADERS_SAMPLE),
      searchFilters: {
        ...this.$accessor.search.sample.filters.byIds,
        ...this.$accessor.search.globalFilters.byIds,
      },
    })
    this.items = response.items
    this.count = response.count
  },
  head(): MetaInfo {
    return {
      title: this.$t('sample.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('sample.pageTitle') as string,
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
    ...mapFields('search/sample', {
      query: 'query',
      items: 'items',
      count: 'count',
      options: 'options',
      number: 'filters.byIds.number.value',
      locality: 'filters.byIds.locality.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      depth: 'filters.byIds.depth.value',
      collector: 'filters.byIds.collector.value',
      mass: 'filters.byIds.mass.value',
      project: 'filters.byIds.project.value',
    }),
    icons(): any {
      return {
        mdiTestTube,
      }
    },
    queryParams(): { [K: string]: any } {
      return getQueryParams({
        q: { key: qParamKey, value: this.$accessor.search.sample.query },
        filters: this.$accessor.search.sample.filters.byIds,
        globalFilters: this.$accessor.search.globalFilters.byIds,
        tableOptions: this.options,
      })
    },
  },
  watch: {
    '$route.query': {
      async handler() {
        await this.$accessor.search.sample.resetFilters()
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
        filters: this.$accessor.search.sample.filters.byIds,
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
      await this.$accessor.search.sample.resetFilters()
      this.$fetch()
    },
    async handleFormUpdate() {
      this.options.page = 1

      await new Promise((resolve, reject) =>
        this.$router.push({ query: this.queryParams }, resolve, reject)
      )
      this.$fetch()
    },
    async handleDataTableUpdate(tableState: any) {
      this.options = tableState.options
      await new Promise((resolve, reject) =>
        this.$router.push({ query: this.queryParams }, resolve, reject)
      )
      this.$fetch()
    },
  },
})
</script>
