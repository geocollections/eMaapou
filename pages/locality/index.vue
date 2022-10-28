<template>
  <search>
    <template #title>
      <base-header
        :title="$t('locality.pageTitle')"
        :icon="icons.mdiMapMarkerOutline"
      />
    </template>

    <template #form>
      <search-form-locality
        @update="handleFormUpdate"
        @reset="handleFormReset"
      />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <v-card>
        <data-table-locality
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          dynamic-headers
          :is-loading="$fetchState.pending"
          stateful-headers
          @update="handleDataTableUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script lang="ts">
import { mdiMapMarkerOutline } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import isEqual from 'lodash/isEqual'
import SearchFormLocality from '~/components/search/forms/SearchFormLocality.vue'
import DataTableLocality from '~/components/data-table/DataTableLocality.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import getQueryParams from '~/utils/getQueryParams'
import parseQueryParams from '~/utils/parseQueryParams'
import { HEADERS_LOCALITY } from '~/constants'
const qParamKey = 'localityQ'
export default Vue.extend({
  components: {
    Search,
    DataTableLocality,
    SearchFormLocality,
    BaseHeader,
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList('locality', {
      options: this.options,
      search: this.query,
      fields: this.$getAPIFieldValues(HEADERS_LOCALITY),
      searchFilters: {
        ...this.$accessor.search.locality.filters.byIds,
        ...{ geoJSON: this.$accessor.search.globalFilters.byIds.geoJSON },
      },
    })
    this.items = response.items
    this.count = response.count
  },
  head(): MetaInfo {
    return {
      title: this.$t('locality.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('locality.pageTitle') as string,
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
    ...mapFields('search/locality', {
      options: 'options',
      items: 'items',
      count: 'count',
      query: 'query',
      name: 'filters.byIds.name.value',
      country: 'filters.byIds.country.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      reference: 'filters.byIds.reference.value',
    }),
    icons(): any {
      return {
        mdiMapMarkerOutline,
      }
    },
    queryParams(): { [K: string]: any } {
      return getQueryParams({
        q: { key: qParamKey, value: this.$accessor.search.locality.query },
        filters: this.$accessor.search.locality.filters.byIds,
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
        await this.$accessor.search.resetFilters('locality')
        this.setStateFromQueryParams()
        this.$fetch()
      },
    },
  },
  created() {
    // Add global filters and table options to query params, if they are missing
    const query = getQueryParams({
      globalFilters: {
        geoJSON: this.$accessor.search.globalFilters.byIds.geoJSON,
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
        filters: this.$accessor.search.locality.filters.byIds,
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
      await this.$accessor.search.resetFilters('locality')
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
