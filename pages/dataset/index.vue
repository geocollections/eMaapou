<template>
  <search>
    <template #title>
      <base-header
        :title="$t('dataset.pageTitle')"
        :icon="icons.mdiDatabaseOutline"
      />
    </template>

    <template #form>
      <search-form-dataset
        @update="handleFormUpdate"
        @reset="handleFormReset"
      />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-dataset
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
import { mdiDatabaseOutline } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import isEqual from 'lodash/isEqual'
import DataTableDataset from '~/components/data-table/DataTableDataset.vue'
import SearchFormDataset from '~/components/search/forms/SearchFormDataset.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_DATASET } from '~/constants'
import getQueryParams from '~/utils/getQueryParams'
import parseQueryParams from '~/utils/parseQueryParams'

const qParamKey = 'datasetQ'

export default Vue.extend({
  components: {
    Search,
    SearchFormDataset,
    DataTableDataset,
    BaseHeader,
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList('dataset', {
      options: this.options,
      search: this.query,
      fields: this.$getAPIFieldValues(HEADERS_DATASET),
      searchFilters: {
        ...this.$accessor.search.dataset.filters.byIds,
        institutions: this.$accessor.search.globalFilters.byIds.institutions,
      },
    })
    this.items = response.items
    this.count = response.count
  },
  head(): MetaInfo {
    return {
      title: this.$t('dataset.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('dataset.pageTitle') as string,
        },
      ],
    }
  },
  computed: {
    ...mapFields('search/dataset', {
      query: 'query',
      items: 'items',
      count: 'count',
      options: 'options',
      name: 'filters.byIds.name.value',
      owner: 'filters.byIds.owner.value',
      date: 'filters.byIds.date.value',
      remarks: 'filters.byIds.remarks.value',
      parameters: 'filters.byIds.parameters.value',
    }),
    ...mapFields('search', {
      institutions: 'globalFilters.byIds.institutions.value',
    }),
    icons(): any {
      return {
        mdiDatabaseOutline,
      }
    },
    queryParams(): { [K: string]: any } {
      return getQueryParams({
        q: { key: qParamKey, value: this.$accessor.search.dataset.query },
        filters: this.$accessor.search.dataset.filters.byIds,
        globalFilters: {
          institutions: this.$accessor.search.globalFilters.byIds.institutions,
        },
        tableOptions: this.options,
      })
    },
  },
  watch: {
    '$route.query': {
      async handler() {
        await this.$accessor.search.dataset.resetFilters()
        this.setStateFromQueryParams()
        this.$fetch()
      },
    },
  },
  created() {
    // Add global filters and table options to query params, if they are missing
    const query = getQueryParams({
      globalFilters: {
        institutions: this.$accessor.search.globalFilters.byIds.institutions,
      },
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
        filters: this.$accessor.search.dataset.filters.byIds,
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

      if (!isEqual({}, this.$route.query)) {
        // NOTE: https://github.com/nuxt/nuxt.js/issues/6951#issuecomment-904655674
        await new Promise((resolve, reject) =>
          this.$router.push({ query: {} }, resolve, reject)
        )
      }
      await this.$accessor.search.dataset.resetFilters()
      this.$fetch()
    },
    async handleFormUpdate() {
      this.options.page = 1
      if (!isEqual(this.queryParams, this.$route.query)) {
        await new Promise((resolve, reject) =>
          this.$router.push({ query: this.queryParams }, resolve, reject)
        )
      }
      this.$fetch()
    },
    async handleDataTableUpdate(tableState: any) {
      this.options = tableState.options
      if (!isEqual(this.queryParams, this.$route.query)) {
        await new Promise((resolve, reject) =>
          this.$router.push({ query: this.queryParams }, resolve, reject)
        )
      }
      this.$fetch()
    },
  },
})
</script>
