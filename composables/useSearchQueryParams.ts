import {
  useRoute,
  useRouter,
  computed,
  watch,
  ComputedRef,
  Ref,
} from '@nuxtjs/composition-api'
import isEqual from 'lodash/isEqual'
import { useAccessor } from './useAccessor'
import getQueryParams from '~/utils/getQueryParams'
import parseQueryParams from '~/utils/parseQueryParams'
import searchModule from '~/store/search'
import { SearchModuleState } from '~/store/search/types'
import { SearchState } from '~/store/search/state'
export const useSearchQueryParams = <Filters extends string | number | symbol>({
  module,
  qParamKey,
  filters,
  globalFilters,
  fetch,
}: {
  module: keyof typeof searchModule.modules
  qParamKey: string
  filters: Ref<SearchModuleState<Filters>['filters']>
  globalFilters?: ComputedRef<SearchState['globalFilters']>
  fetch: any
}) => {
  const accessor = useAccessor()
  const route = useRoute()
  const router = useRouter()

  const queryParams = computed(() =>
    getQueryParams({
      q: { key: qParamKey, value: accessor.search[module].query },
      filters: filters.value,
      globalFilters: globalFilters?.value ?? {},
      tableOptions: accessor.search[module].options,
    })
  )

  const setStateFromQueryParams = () => {
    const parsedValues = parseQueryParams({
      route: route.value,
      filters: filters.value,
      globalFilters: globalFilters?.value ?? {},
      qKey: qParamKey,
    })
    accessor.search[module].SET_MODULE_QUERY({ query: parsedValues.query })
    if (parsedValues.filters) {
      for (const key in parsedValues.filters) {
        // ??? For some reason the `payload` for the action is of type `never`.
        // This is the only action to be this way. May have something to do with the type of `key` set in the actions.
        accessor.search[module].setFilterValue({
          key,
          value: parsedValues.filters?.[key as Filters],
        } as never)
      }
    }
    if (parsedValues.globalFilters) {
      Object.keys(parsedValues.globalFilters).forEach((key) => {
        const globalFilterKey = key as keyof SearchState['globalFilters']
        accessor.search.SET_GLOBAL_FILTER_VALUE({
          key: globalFilterKey,
          value: parsedValues.globalFilters?.[globalFilterKey],
        })
      })
    }

    accessor.search[module].SET_MODULE_OPTIONS({
      options: {
        ...accessor.search[module].options,
        ...parsedValues.options,
      },
    })
  }

  // Add global filters and table options to query params, if they are missing
  const query = getQueryParams({
    globalFilters: globalFilters?.value ?? {},
    tableOptions: accessor.search[module].options,
  })
  if (!isEqual({ ...query, ...route.value.query }, route.value.query))
    router.replace({ query: { ...query, ...route.value.query } })
  setStateFromQueryParams()

  watch(
    () => route.value.query,
    () => {
      // await accessor.search[module].resetFilters()
      setStateFromQueryParams()
      fetch()
    }
  )
  const handleFormReset = async () => {
    accessor.search[module].SET_MODULE_OPTIONS({
      options: { ...accessor.search[module].options, page: 1 },
    })
    await accessor.search[module].resetFilters()
    if (!isEqual(queryParams.value, route.value.query)) {
      // NOTE: https://github.com/nuxt/nuxt.js/issues/6951#issuecomment-904655674
      await new Promise((resolve, reject) =>
        router.push({ query: queryParams.value }, resolve, reject)
      )
    }
    fetch()
  }
  const handleFormUpdate = async () => {
    accessor.search[module].SET_MODULE_OPTIONS({
      options: { ...accessor.search[module].options, page: 1 },
    })
    if (!isEqual(queryParams.value, route.value.query)) {
      await new Promise((resolve, reject) =>
        router.push({ query: queryParams.value }, resolve, reject)
      )
    }
    fetch()
  }
  const handleDataTableUpdate = async (tableState: any) => {
    accessor.search[module].SET_MODULE_OPTIONS({
      options: tableState.options,
    })
    if (!isEqual(queryParams.value, route.value.query)) {
      await new Promise((resolve, reject) =>
        router.push({ query: queryParams.value }, resolve, reject)
      )
    }
    fetch()
  }
  return {
    handleFormReset,
    handleFormUpdate,
    handleDataTableUpdate,
  }
}
