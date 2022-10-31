<template>
  <search>
    <template #title>
      <base-header
        :title="$t('site.pageTitle')"
        :icon="icons.mdiMapMarkerStarOutline"
      />
    </template>

    <template #form>
      <search-form-site @update="handleFormUpdate" @reset="handleFormReset" />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-site
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
import { mdiMapMarkerStarOutline } from '@mdi/js'
import { mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import isEqual from 'lodash/isEqual'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import SearchFormSite from '~/components/search/forms/SearchFormSite.vue'
import DataTableSite from '~/components/data-table/DataTableSite.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import parseQueryParams from '~/utils/parseQueryParams'
import getQueryParams from '~/utils/getQueryParams'
import { HEADERS_SITE } from '~/constants'
const qParamKey = 'siteQ'
export default Vue.extend({
  components: {
    Search,
    SearchFormSite,
    DataTableSite,
    BaseHeader,
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList('site', {
      options: this.options,
      search: this.query,
      fields: this.$getAPIFieldValues(HEADERS_SITE),
      searchFilters: {
        ...this.$accessor.search.site.filters.byIds,
        ...{
          geoJSON: this.$accessor.search.globalFilters.byIds.geoJSON,
        },
      },
    })
    this.items = response.items
    this.count = response.count
  },
  head(): MetaInfo {
    return {
      title: this.$t('site.pageTitle').toString(),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('site.pageTitle').toString(),
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
    ...mapFields('search/site', {
      query: 'query',
      items: 'items',
      count: 'count',
      options: 'options',
      name: 'filters.byIds.name.value',
      latitude: 'filters.byIds.latitude.value',
      longitude: 'filters.byIds.longitude.value',
      area: 'filters.byIds.area.value',
      project: 'filters.byIds.project.value',
    }),
    icons(): any {
      return {
        mdiMapMarkerStarOutline,
      }
    },
    queryParams(): { [K: string]: any } {
      return getQueryParams({
        q: { key: qParamKey, value: this.$accessor.search.site.query },
        filters: this.$accessor.search.site.filters.byIds,
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
    ...mapActions('search/site', ['searchSites']),
    setStateFromQueryParams() {
      const parsedValues = parseQueryParams({
        route: this.$route,
        filters: this.$accessor.search.site.filters.byIds,
        globalFilters: {
          geoJSON: this.$accessor.search.globalFilters.byIds.geoJSON,
        },
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
      await this.$accessor.search.resetFilters('site')
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
