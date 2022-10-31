<template>
  <search>
    <template #title>
      <base-header
        :title="$t('taxon.pageTitle')"
        :subtitle="$t('common.count', { count: count })"
        :icon="icons.mdiFamilyTree"
      />
    </template>

    <template #form>
      <search-form-taxon @update="handleFormUpdate" @reset="handleFormReset" />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-taxon
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
import { mdiFamilyTree } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import isEqual from 'lodash/isEqual'
import Search from '~/templates/Search.vue'
import SearchFormTaxon from '~/components/search/forms/SearchFormTaxon.vue'
import DataTableTaxon from '~/components/data-table/DataTableTaxon.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import parseQueryParams from '~/utils/parseQueryParams'
import getQueryParams from '~/utils/getQueryParams'
import { HEADERS_TAXON } from '~/constants'
const qParamKey = 'taxonQ'
export default Vue.extend({
  components: {
    Search,
    SearchFormTaxon,
    DataTableTaxon,
    BaseHeader,
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList('taxon', {
      options: this.options,
      search: this.query,
      fields: this.$getAPIFieldValues(HEADERS_TAXON),
      searchFilters: {
        ...this.$accessor.search.taxon.filters.byIds,
        ...this.$accessor.search.globalFilters.byIds,
      },
    })
    this.items = response.items
    this.count = response.count
  },
  head(): MetaInfo {
    return {
      title: this.$t('taxon.pageTitle').toString(),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('taxon.pageTitle').toString(),
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
    ...mapFields('search/taxon', {
      query: 'query',
      items: 'items',
      count: 'count',
      options: 'options',
      species: 'filters.byIds.species.value',
      locality: 'filters.byIds.locality.value',
      stratigraphyHierarchy: 'filters.byIds.stratigraphyHierarchy.value',
      taxonHierarchy: 'filters.byIds.taxonHierarchy.value',
      author: 'filters.byIds.author.value',
    }),
    ...mapFields('search', {
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    icons(): any {
      return {
        mdiFamilyTree,
      }
    },
    queryParams(): { [K: string]: any } {
      return getQueryParams({
        q: { key: qParamKey, value: this.$accessor.search.taxon.query },
        filters: this.$accessor.search.taxon.filters.byIds,
        globalFilters: {
          geoJSON: this.$accessor.search.globalFilters.byIds.geoJSON,
        },
        tableOptions: this.options,
      })
    },
  },
  watch: {
    '$route.query': {
      async handler() {
        await this.$accessor.search.taxon.resetFilters()
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
        filters: this.$accessor.search.taxon.filters.byIds,
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
      await this.$accessor.search.taxon.resetFilters()
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
