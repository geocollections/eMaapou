<template>
  <search>
    <template #title>
      <base-header
        :title="$t('drillcore.pageTitle')"
        :icon="icons.mdiScrewMachineFlatTop"
      />
    </template>

    <template #form>
      <search-form-drillcore
        @update="handleFormUpdate"
        @reset="handleFormReset"
      />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <v-card>
        <data-table-drillcore
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          :flat="false"
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
import { mdiScrewMachineFlatTop } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import isEqual from 'lodash/isEqual'
import SearchFormDrillcore from '~/components/search/forms/SearchFormDrillcore.vue'
import DataTableDrillcore from '~/components/data-table/DataTableDrillcore.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_DRILLCORE } from '~/constants'
import getQueryParams from '~/utils/getQueryParams'
import parseQueryParams from '~/utils/parseQueryParams'
const qParamKey = 'drillcoreQ'
export default Vue.extend({
  components: {
    Search,
    SearchFormDrillcore,
    DataTableDrillcore,
    BaseHeader,
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList(
      'drillcore',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_DRILLCORE),
        searchFilters: {
          ...this.$accessor.search.drillcore.filters.byIds,
          ...this.$accessor.search.globalFilters.byIds,
        },
      }
    )
    this.items = response.items
    this.count = response.count
  },
  head(): MetaInfo {
    return {
      title: this.$t('drillcore.pageTitle') as string,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('drillcore.pageTitle') as string,
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
    ...mapFields('search/drillcore', {
      options: 'options',
      items: 'items',
      count: 'count',
      query: 'query',
      name: 'filters.byIds.name.value',
      country: 'filters.byIds.country.value',
      repository: 'filters.byIds.repository.value',
      storage: 'filters.byIds.storage.value',
      boxes: 'filters.byIds.boxes.value',
    }),
    icons(): any {
      return {
        mdiScrewMachineFlatTop,
      }
    },
    queryParams(): { [K: string]: any } {
      return getQueryParams({
        q: { key: qParamKey, value: this.$accessor.search.drillcore.query },
        filters: this.$accessor.search.drillcore.filters.byIds,
        globalFilters: this.$accessor.search.globalFilters.byIds,
        tableOptions: this.options,
      })
    },
  },
  watch: {
    '$route.query': {
      async handler() {
        await this.$accessor.search.resetFilters('drillcore')
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
        filters: this.$accessor.search.drillcore.filters.byIds,
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
      await this.$accessor.search.resetFilters('drillcore')
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
