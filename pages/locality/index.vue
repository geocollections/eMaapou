<template>
  <search>
    <template #title>
      <header-search
        :title="$t('locality.pageTitle').toString()"
        :count="$accessor.search.locality.count"
        :icon="icons.mdiMapMarker"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-locality
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
        <data-table-locality
          :show-search="false"
          :items="$accessor.search.locality.items"
          :count="$accessor.search.locality.count"
          :options="$accessor.search.locality.options"
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
import {
  defineComponent,
  useFetch,
  wrapProperty,
  computed,
} from '@nuxtjs/composition-api'
import { mdiMapMarker } from '@mdi/js'
import SearchFormLocality from '~/components/search/forms/SearchFormLocality.vue'
import DataTableLocality from '~/components/data-table/DataTableLocality.vue'
import Search from '~/templates/Search.vue'
import HeaderSearch from '~/components/HeaderSearch.vue'
import { HEADERS_LOCALITY } from '~/constants'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'
import { useAccessor } from '~/composables/useAccessor'

const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)
export default defineComponent({
  components: {
    Search,
    DataTableLocality,
    SearchFormLocality,
    HeaderSearch,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('locality', {
        options: accessor.search.locality.options,
        search: accessor.search.locality.query,
        fields: getAPIFieldValues(HEADERS_LOCALITY),
        searchFilters: {
          ...accessor.search.locality.filters,
          ...accessor.search.globalFilters,
        },
      })
      accessor.search.locality.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.locality.SET_MODULE_COUNT({ count: response.count })
    })
    const filters = computed(() => accessor.search.locality.filters)

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'locality',
        qParamKey: 'localityQ',
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
    icons(): any {
      return {
        mdiMapMarker,
      }
    },
  },
})
</script>
