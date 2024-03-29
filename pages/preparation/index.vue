<template>
  <search>
    <template #title>
      <header-search
        :title="$t('preparation.pageTitle').toString()"
        :count="$accessor.search.preparation.count"
        :icon="icons.mdiEyedropper"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-preparation
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
        <data-table-preparation
          :show-search="false"
          :items="$accessor.search.preparation.items"
          :count="$accessor.search.preparation.count"
          :options="$accessor.search.preparation.options"
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
import { mdiEyedropper } from '@mdi/js'
import DataTablePreparation from '~/components/data-table/DataTablePreparation.vue'
import SearchFormPreparation from '~/components/search/forms/SearchFormPreparation.vue'
import Search from '~/templates/Search.vue'
import HeaderSearch from '~/components/HeaderSearch.vue'
import { HEADERS_PREPARATION } from '~/constants'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'
import { useAccessor } from '~/composables/useAccessor'

const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)
export default defineComponent({
  name: 'PreparationSearch',
  components: {
    Search,
    SearchFormPreparation,
    DataTablePreparation,
    HeaderSearch,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('preparation', {
        options: accessor.search.preparation.options,
        search: accessor.search.preparation.query,
        fields: getAPIFieldValues(HEADERS_PREPARATION),
        searchFilters: {
          ...accessor.search.preparation.filters,
          ...accessor.search.globalFilters,
        },
      })
      accessor.search.preparation.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.preparation.SET_MODULE_COUNT({ count: response.count })
    })
    const filters = computed(() => accessor.search.preparation.filters)
    const globalFilters = computed(() => accessor.search.globalFilters)

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'preparation',
        qParamKey: 'preparationQ',
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
    icons(): any {
      return { mdiEyedropper }
    },
  },
})
</script>
