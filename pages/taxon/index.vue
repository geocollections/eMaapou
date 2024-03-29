<template>
  <search>
    <template #title>
      <header-search
        :title="$t('taxon.pageTitle').toString()"
        :count="$accessor.search.taxon.count"
        :icon="icons.mdiFamilyTree"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-taxon
        @update="
          handleFormUpdate()
          closeMobileSearch && closeMobileSearch()
        "
        @reset="
          handleFormReset()
          closeMobileSearch && closeMobileSearch()
        "
      />
    </template>

    <template #result>
      <v-card>
        <data-table-taxon
          :show-search="false"
          :items="$accessor.search.taxon.items"
          :count="$accessor.search.taxon.count"
          :options="$accessor.search.taxon.options"
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
import {
  defineComponent,
  useFetch,
  wrapProperty,
  computed,
} from '@nuxtjs/composition-api'
import { mdiFamilyTree } from '@mdi/js'
import Search from '~/templates/Search.vue'
import SearchFormTaxon from '~/components/search/forms/SearchFormTaxon.vue'
import DataTableTaxon from '~/components/data-table/DataTableTaxon.vue'
import HeaderSearch from '~/components/HeaderSearch.vue'
import { HEADERS_TAXON } from '~/constants'
import { useAccessor } from '~/composables/useAccessor'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'

const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)
export default defineComponent({
  components: {
    Search,
    SearchFormTaxon,
    DataTableTaxon,
    HeaderSearch,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('taxon', {
        options: accessor.search.taxon.options,
        search: accessor.search.taxon.query,
        fields: getAPIFieldValues(HEADERS_TAXON),
        searchFilters: {
          ...accessor.search.taxon.filters,
          ...accessor.search.globalFilters,
        },
      })

      accessor.search.taxon.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.taxon.SET_MODULE_COUNT({ count: response.count })
    })
    const filters = computed(() => accessor.search.taxon.filters)
    const globalFilters = computed(() => accessor.search.globalFilters)

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'taxon',
        qParamKey: 'taxonQ',
        filters,
        globalFilters,
        fetch,
      })

    return {
      handleFormReset,
      handleFormUpdate,
      handleDataTableUpdate,
    }
  },
  head() {
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
    icons(): any {
      return {
        mdiFamilyTree,
      }
    },
  },
})
</script>
