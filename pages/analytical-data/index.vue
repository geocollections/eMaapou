<template>
  <search>
    <template #title>
      <base-header
        :title="$t('analyticalData.pageTitle').toString()"
        :icon="icons.mdiChartLine"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-analytical-data
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
      <div class="py-1 pl-2 text-h6">
        {{
          $accessor.search.analyticalData.count
            ? $tc('common.count', $accessor.search.analyticalData.count)
            : '&nbsp;'
        }}
      </div>

      <v-card>
        <data-table-analytical-data
          :show-search="false"
          :items="$accessor.search.analyticalData.items"
          :count="$accessor.search.analyticalData.count"
          :options="$accessor.search.analyticalData.options"
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
  useMeta,
  useContext,
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
    const { i18n } = useContext()
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList(
        'analytical_data',
        {
          options: accessor.search.analyticalData.options,
          search: accessor.search.analyticalData.query,
          fields: getAPIFieldValues(HEADERS_ANALYTICAL_DATA),
          searchFilters: {
            ...accessor.search.analyticalData.filters,
            ...accessor.search.globalFilters,
            ...accessor.search.analyticalData.parameterFilters.byId,
          },
        }
      )
      accessor.search.analyticalData.SET_MODULE_ITEMS({
        items: response.items,
      })
      accessor.search.analyticalData.SET_MODULE_COUNT({
        count: response.count,
      })
    })
    const filters = computed(() => accessor.search.analyticalData.filters)
    const globalFilters = computed(() => accessor.search.globalFilters)
    const icons = computed(() => {
      return {
        mdiChartLine,
      }
    })
    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'analyticalData',
        qParamKey: 'analyticalDataQ',
        filters,
        globalFilters,
        fetch,
      })
    useMeta(() => {
      return {
        title: i18n.t('analyticalData.pageTitle') as string,
        meta: [
          {
            property: 'og:title',
            content: i18n.t('analyticalData.pageTitle') as string,
            hid: 'og:title',
          },
        ],
      }
    })
    return {
      handleFormReset,
      handleFormUpdate,
      handleDataTableUpdate,
      icons,
    }
  },
  head: {},
})
</script>
