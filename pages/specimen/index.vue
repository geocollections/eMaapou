<template>
  <search>
    <template #title>
      <base-header
        :title="$t('specimen.pageTitle')"
        :icon="icons.mdiMicroscope"
      />
    </template>

    <template #form>
      <search-form-specimen
        @update="handleFormUpdate"
        @reset="handleFormReset"
      />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-specimen
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
import { mdiMicroscope } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import isEqual from 'lodash/isEqual'
import SearchFormSpecimen from '~/components/search/forms/SearchFormSpecimen.vue'
import DataTableSpecimen from '~/components/data-table/DataTableSpecimen.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import parseQueryParams from '~/utils/parseQueryParams'
import getQueryParams from '~/utils/getQueryParams'
import { HEADERS_SPECIMEN } from '~/constants'
const qParamKey = 'specimenQ'
export default Vue.extend({
  components: {
    Search,
    SearchFormSpecimen,
    DataTableSpecimen,
    BaseHeader,
  },
  async fetch() {
    const response = await this.$services.sarvSolr.getResourceList('specimen', {
      options: this.options,
      search: this.query,
      fields: this.$getAPIFieldValues(HEADERS_SPECIMEN),
      searchFilters: {
        ...this.$accessor.search.specimen.filters.byIds,
        ...this.$accessor.search.globalFilters.byIds,
      },
    })
    this.items = response.items
    this.count = response.count
  },
  head(): MetaInfo {
    return {
      title: this.$t('specimen.pageTitle').toString(),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('specimen.pageTitle').toString(),
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
    ...mapFields('search/specimen', {
      query: 'query',
      items: 'items',
      count: 'count',
      options: 'options',
      number: 'filters.byIds.number.value',
      collectionNr: 'filters.byIds.collectionNr.value',
      locality: 'filters.byIds.locality.value',
      fossilName: 'filters.byIds.fossilName.value',
      fossil: 'filters.byIds.fossil.value',
      rock: 'filters.byIds.rock.value',
      reference: 'filters.byIds.reference.value',
      stratigraphyHierarchy: 'filters.byIds.stratigraphyHierarchy.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      has_image: 'filters.byIds.has_image.value',
      has_map: 'filters.byIds.has_map.value',
    }),
    ...mapFields('search', {
      geoJSON: 'globalFilters.byIds.geoJSON.value',
      institutions: 'globalFilters.byIds.institutions.value',
    }),
    icons(): any {
      return {
        mdiMicroscope,
      }
    },
    queryParams(): { [K: string]: any } {
      return getQueryParams({
        q: { key: qParamKey, value: this.$accessor.search.specimen.query },
        filters: this.$accessor.search.specimen.filters.byIds,
        globalFilters: this.$accessor.search.globalFilters.byIds,
        tableOptions: this.options,
      })
    },
  },
  watch: {
    '$route.query': {
      async handler() {
        await this.$accessor.search.specimen.resetFilters()
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
        filters: this.$accessor.search.specimen.filters.byIds,
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
      await this.$accessor.search.specimen.resetFilters()
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
