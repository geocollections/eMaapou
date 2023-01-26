<template>
  <search>
    <template #title>
      <header-search
        :title="$t('stratigraphy.pageTitle').toString()"
        :count="$accessor.search.stratigraphy.count"
        :icon="icons.mdiLayersTriple"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-stratigraphy
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
        <data-table-stratigraphy
          :show-search="false"
          :items="$accessor.search.stratigraphy.items"
          :count="$accessor.search.stratigraphy.count"
          :options="$accessor.search.stratigraphy.options"
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
import {
  defineComponent,
  useFetch,
  wrapProperty,
  computed,
} from '@nuxtjs/composition-api'
import { mdiLayersTriple } from '@mdi/js'
import Search from '~/templates/Search.vue'
import SearchFormStratigraphy from '~/components/search/forms/SearchFormStratigraphy.vue'
import DataTableStratigraphy from '~/components/data-table/DataTableStratigraphy.vue'
import HeaderSearch from '~/components/HeaderSearch.vue'
import { HEADERS_STRATIGRAPHY } from '~/constants'
import { useAccessor } from '~/composables/useAccessor'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'

const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)
export default defineComponent({
  components: {
    Search,
    SearchFormStratigraphy,
    DataTableStratigraphy,
    HeaderSearch,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('stratigraphy', {
        options: accessor.search.stratigraphy.options,
        search: accessor.search.stratigraphy.query,
        fields: getAPIFieldValues(HEADERS_STRATIGRAPHY),
        searchFilters: {
          ...accessor.search.stratigraphy.filters,
          ...accessor.search.globalFilters,
        },
      })
      accessor.search.stratigraphy.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.stratigraphy.SET_MODULE_COUNT({ count: response.count })
    })
    const filters = computed(() => accessor.search.stratigraphy.filters)

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'stratigraphy',
        qParamKey: 'stratigraphyQ',
        filters,
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
    icons(): any {
      return {
        mdiLayersTriple,
      }
    },
  },
})
</script>
