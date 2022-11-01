<template>
  <search>
    <template #title>
      <base-header
        :title="$t('analyticalData.pageTitle')"
        :icon="icons.mdiChartLine"
      />
    </template>

    <template #form>
      <search-form-analytical-data
        @update="handleFormUpdate"
        @reset="handleFormReset"
      />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{
          $accessor.search.analytical_data.count
            ? $tc('common.count', $accessor.search.analytical_data.count)
            : '&nbsp;'
        }}
      </div>

      <v-card>
        <data-table-analytical-data
          :show-search="false"
          :items="$accessor.search.analytical_data.items"
          :count="$accessor.search.analytical_data.count"
          :options="$accessor.search.analytical_data.options"
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
import { mdiChartLine } from '@mdi/js'
import DataTableAnalyticalData from '~/components/data-table/DataTableAnalyticalData.vue'
import SearchFormAnalyticalData from '~/components/search/forms/SearchFormAnalyticalData.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_ANALYTICAL_DATA } from '~/constants/headers'
import { useAccessor } from '~/composables/useAccessor'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'

const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)
export default defineComponent({
  name: 'AnalyticalDataSearch',
  components: {
    Search,
    SearchFormAnalyticalData,
    DataTableAnalyticalData,
    BaseHeader,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList(
        'analytical_data',
        {
          options: accessor.search.analytical_data.options,
          search: accessor.search.analytical_data.query,
          fields: getAPIFieldValues(HEADERS_ANALYTICAL_DATA),
          searchFilters: {
            ...accessor.search.analytical_data.filters.byIds,
            ...accessor.search.globalFilters.byIds,
            ...accessor.search.analytical_data.parameterFilters.byIds,
          },
        }
      )
      accessor.search.analytical_data.SET_MODULE_ITEMS({
        items: response.items,
      })
      accessor.search.analytical_data.SET_MODULE_COUNT({
        count: response.count,
      })
    })
    const filters = computed(
      () => accessor.search.analytical_data.filters.byIds
    )
    const globalFilters = computed(() => accessor.search.globalFilters.byIds)

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'analytical_data',
        qParamKey: 'analyticalDataQ',
        filters: filters.value,
        globalFilters: globalFilters.value,
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
      title: this.$t('analyticalData.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          content: this.$t('analyticalData.pageTitle') as string,
          hid: 'og:title',
        },
      ],
    }
  },
  computed: {
    icons(): any {
      return {
        mdiChartLine,
      }
    },
  },
})
</script>
