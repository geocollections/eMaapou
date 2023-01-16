<template>
  <search>
    <template #title>
      <base-header
        :title="$t('dataset.pageTitle').toString()"
        :icon="icons.mdiDatabaseOutline"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-dataset
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
      <div class="py-1 text-h6">
        {{
          $accessor.search.dataset.count
            ? $tc('common.count', $accessor.search.dataset.count)
            : '&nbsp;'
        }}
      </div>

      <v-card>
        <data-table-dataset
          :show-search="false"
          :items="$accessor.search.dataset.items"
          :count="$accessor.search.dataset.count"
          :options="$accessor.search.dataset.options"
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
import { mdiDatabaseOutline } from '@mdi/js'
import DataTableDataset from '~/components/data-table/DataTableDataset.vue'
import SearchFormDataset from '~/components/search/forms/SearchFormDataset.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_DATASET } from '~/constants'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'
import { useAccessor } from '~/composables/useAccessor'

const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)
export default defineComponent({
  components: {
    Search,
    SearchFormDataset,
    DataTableDataset,
    BaseHeader,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('dataset', {
        options: accessor.search.dataset.options,
        search: accessor.search.dataset.query,
        fields: getAPIFieldValues(HEADERS_DATASET),
        searchFilters: {
          ...accessor.search.dataset.filters,
          ...accessor.search.globalFilters,
        },
      })
      accessor.search.dataset.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.dataset.SET_MODULE_COUNT({ count: response.count })
    })
    const filters = computed(() => accessor.search.dataset.filters)
    const globalFilters = computed(() => {
      return { institutions: accessor.search.globalFilters.institutions }
    })

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'dataset',
        qParamKey: 'datasetQ',
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
      title: this.$t('dataset.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('dataset.pageTitle') as string,
        },
      ],
    }
  },
  computed: {
    icons(): any {
      return {
        mdiDatabaseOutline,
      }
    },
  },
})
</script>
