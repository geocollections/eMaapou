<template>
  <search>
    <template #title>
      <base-header
        :title="$t('analysis.pageTitle')"
        :icon="icons.mdiChartScatterPlot"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-analysis
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
          $accessor.search.analysis.count
            ? $tc('common.count', $accessor.search.analysis.count)
            : '&nbsp;'
        }}
      </div>
      <v-card>
        <data-table-analysis
          :show-search="false"
          :items="$accessor.search.analysis.items"
          :count="$accessor.search.analysis.count"
          :options="$accessor.search.analysis.options"
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
import { mdiChartScatterPlot } from '@mdi/js'
import { useAccessor } from '~/composables/useAccessor'
import DataTableAnalysis from '~/components/data-table/DataTableAnalysis.vue'
import SearchFormAnalysis from '~/components/search/forms/SearchFormAnalysis.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_ANALYSIS } from '~/constants'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'
const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)
export default defineComponent({
  name: 'AnalysisSearch',
  components: {
    Search,
    SearchFormAnalysis,
    DataTableAnalysis,
    BaseHeader,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('analysis', {
        options: accessor.search.analysis.options,
        search: accessor.search.analysis.query,
        fields: getAPIFieldValues(HEADERS_ANALYSIS),
        searchFilters: {
          ...accessor.search.analysis.filters.byIds,
          ...accessor.search.globalFilters.byIds,
        },
      })
      accessor.search.analysis.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.analysis.SET_MODULE_COUNT({ count: response.count })
    })
    const filters = computed(() => accessor.search.analysis.filters.byIds)
    const globalFilters = computed(() => accessor.search.globalFilters.byIds)

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'analysis',
        qParamKey: 'analysisQ',
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
      title: this.$t('analysis.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          content: this.$t('analysis.pageTitle') as string,
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
    icons() {
      return { mdiChartScatterPlot }
    },
  },
})
</script>
