<template>
  <search>
    <template #title>
      <base-header :title="$t('sample.pageTitle')" :icon="icons.mdiTestTube" />
    </template>

    <template #form>
      <search-form-sample @update="handleFormUpdate" @reset="handleFormReset" />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{
          $accessor.search.sample.count
            ? $tc('common.count', $accessor.search.sample.count)
            : '&nbsp;'
        }}
      </div>

      <v-card>
        <data-table-sample
          :show-search="false"
          :items="$accessor.search.sample.items"
          :count="$accessor.search.sample.count"
          :options="$accessor.search.sample.options"
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
import { mdiTestTube } from '@mdi/js'
import SearchFormSample from '~/components/search/forms/SearchFormSample.vue'
import DataTableSample from '~/components/data-table/DataTableSample.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_SAMPLE } from '~/constants'
import { useAccessor } from '~/composables/useAccessor'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'

const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)
export default defineComponent({
  components: {
    Search,
    SearchFormSample,
    DataTableSample,
    BaseHeader,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('sample', {
        options: accessor.search.sample.options,
        search: accessor.search.sample.query,
        fields: getAPIFieldValues(HEADERS_SAMPLE),
        searchFilters: {
          ...accessor.search.sample.filters.byIds,
          ...accessor.search.globalFilters.byIds,
        },
      })
      accessor.search.sample.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.sample.SET_MODULE_COUNT({ count: response.count })
    })
    const filters = computed(() => accessor.search.sample.filters.byIds)
    const globalFilters = computed(() => accessor.search.globalFilters.byIds)

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'sample',
        qParamKey: 'sampleQ',
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
      title: this.$t('sample.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('sample.pageTitle') as string,
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
        mdiTestTube,
      }
    },
  },
})
</script>
