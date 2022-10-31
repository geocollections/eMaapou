<template>
  <search>
    <template #title>
      <base-header
        :title="$t('stratigraphy.pageTitle')"
        :icon="icons.mdiLayersTriple"
      />
    </template>

    <template #form>
      <search-form-stratigraphy
        @update="handleFormUpdate"
        @reset="handleFormReset"
      />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-stratigraphy
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
import { mdiLayersTriple } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import isEqual from 'lodash/isEqual'
import Search from '~/templates/Search.vue'
import SearchFormStratigraphy from '~/components/search/forms/SearchFormStratigraphy.vue'
import DataTableStratigraphy from '~/components/data-table/DataTableStratigraphy.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import parseQueryParams from '~/utils/parseQueryParams'
import getQueryParams from '~/utils/getQueryParams'
import { HEADERS_STRATIGRAPHY } from '~/constants'
const qParamKey = 'stratigraphyQ'

export default Vue.extend({
  components: {
    Search,
    SearchFormStratigraphy,
    DataTableStratigraphy,
    BaseHeader,
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList(
      'stratigraphy',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_STRATIGRAPHY),
        searchFilters: {
          ...this.$accessor.search.stratigraphy.filters.byIds,
        },
      }
    )
    this.items = response.items
    this.count = response.count
  },
  head(): MetaInfo {
    return {
      title: this.$t('stratigraphy.pageTitle').toString(),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('stratigraphy.pageTitle').toString(),
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
    ...mapFields('search/stratigraphy', {
      query: 'query',
      items: 'items',
      count: 'count',
      options: 'options',
      number: 'filters.byIds.id.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      index: 'filters.byIds.index.value',
      age: 'filters.byIds.age.value',
    }),
    icons(): any {
      return {
        mdiLayersTriple,
      }
    },
    queryParams(): { [K: string]: any } {
      return getQueryParams({
        q: { key: qParamKey, value: this.$accessor.search.stratigraphy.query },
        filters: this.$accessor.search.stratigraphy.filters.byIds,
        tableOptions: this.options,
      })
    },
  },
  watch: {
    '$route.query': {
      async handler() {
        await this.$accessor.search.resetFilters('stratigraphy')
        this.setStateFromQueryParams()
        this.$fetch()
      },
    },
  },
  created() {
    // Add  table options to query params, if they are missing
    const query = getQueryParams({
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
        filters: this.$accessor.search.stratigraphy.filters.byIds,
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
      await this.$accessor.search.resetFilters('stratigraphy')
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
