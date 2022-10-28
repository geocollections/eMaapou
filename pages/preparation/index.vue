<template>
  <search>
    <template #title>
      <base-header
        :title="$t('preparation.pageTitle')"
        :icon="icons.mdiEyedropper"
      />
    </template>

    <template #form>
      <search-form-preparation
        @update="handleFormUpdate"
        @reset="handleFormReset"
      />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-preparation
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
import { mdiEyedropper } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import isEqual from 'lodash/isEqual'
import DataTablePreparation from '~/components/data-table/DataTablePreparation.vue'
import SearchFormPreparation from '~/components/search/forms/SearchFormPreparation.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import getQueryParams from '~/utils/getQueryParams'
import parseQueryParams from '~/utils/parseQueryParams'
import { HEADERS_PREPARATION } from '~/constants'
const qParamKey = 'preparationQ'
export default Vue.extend({
  name: 'PreparationSearch',
  components: {
    Search,
    SearchFormPreparation,
    DataTablePreparation,
    BaseHeader,
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList(
      'preparation',
      {
        options: this.options,
        search: this.query,
        fields: this.$getAPIFieldValues(HEADERS_PREPARATION),
        searchFilters: {
          ...this.$accessor.search.preparation.filters.byIds,
          ...this.$accessor.search.globalFilters.byIds,
        },
      }
    )
    this.items = response.items
    this.count = response.count
  },
  head(): MetaInfo {
    return {
      title: this.$t('preparation.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          content: this.$t('preparation.pageTitle') as string,
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
    ...mapFields('search/preparation', {
      query: 'query',
      items: 'items',
      count: 'count',
      options: 'options',
      number: 'filters.byIds.number.value',
      depth: 'filters.byIds.depth.value',
      locality: 'filters.byIds.locality.value',
      hierarchy: 'filters.byIds.hierarchy.value',
    }),
    icons(): any {
      return { mdiEyedropper }
    },
    queryParams(): { [K: string]: any } {
      return getQueryParams({
        q: { key: qParamKey, value: this.$accessor.search.preparation.query },
        filters: this.$accessor.search.preparation.filters.byIds,
        globalFilters: this.$accessor.search.globalFilters.byIds,
        tableOptions: this.options,
      })
    },
  },
  watch: {
    '$route.query': {
      async handler() {
        await this.$accessor.search.resetFilters('preparation')
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
        filters: this.$accessor.search.preparation.filters.byIds,
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
      await this.$accessor.search.resetFilters('preparation')
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
