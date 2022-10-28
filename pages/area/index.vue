<template>
  <search>
    <template #title>
      <base-header
        :title="$t('area.pageTitle')"
        :icon="icons.mdiMapMarkerRadiusOutline"
      />
    </template>

    <template #form>
      <search-form-area @update="handleFormUpdate" @reset="handleFormReset" />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-area
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
import { mdiMapMarkerRadiusOutline } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import isEqual from 'lodash/isEqual'
import SearchFormArea from '~/components/search/forms/SearchFormArea.vue'
import DataTableArea from '~/components/data-table/DataTableArea.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_AREA } from '~/constants'
import getQueryParams from '~/utils/getQueryParams'
import parseQueryParams from '~/utils/parseQueryParams'
const qParamKey = 'areaQ'
export default Vue.extend({
  components: {
    Search,
    DataTableArea,
    SearchFormArea,
    BaseHeader,
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList('area', {
      options: this.options,
      search: this.query,
      fields: this.$getAPIFieldValues(HEADERS_AREA),
      searchFilters: {
        ...this.$accessor.search.area.filters.byIds,
      },
    })
    this.items = response.items
    this.count = response.count
  },
  head(): MetaInfo {
    return {
      title: this.$t('area.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('area.pageTitle') as string,
        },
      ],
    }
  },
  computed: {
    ...mapFields('search/area', {
      query: 'query',
      items: 'items',
      count: 'count',
      options: 'options',
      name: 'filters.byIds.name.value',
      county: 'filters.byIds.county.value',
      type: 'filters.byIds.county.value',
    }),
    icons(): any {
      return {
        mdiMapMarkerRadiusOutline,
      }
    },
  },
  watch: {
    '$route.query': {
      async handler() {
        await this.$accessor.search.resetFilters('area')
        this.setStateFromQueryParams()
        this.$fetch()
      },
    },
  },
  created() {
    // Add table options to query params, if they are missing
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
        filters: this.$accessor.search.area.filters.byIds,
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
      await this.$accessor.search.resetFilters('area')
      this.$fetch()
    },
    async handleFormUpdate() {
      this.options.page = 1
      const query = getQueryParams({
        q: { key: qParamKey, value: this.$accessor.search.area.query },
        filters: this.$accessor.search.area.filters.byIds,
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
        q: { key: qParamKey, value: this.$accessor.search.area.query },
        filters: this.$accessor.search.area.filters.byIds,
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
