<template>
  <search>
    <template #title>
      <base-header
        :title="$t('area.pageTitle')"
        :icon="icons.mdiMapMarkerRadiusOutline"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-area
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
          $accessor.search.area.count
            ? $tc('common.count', $accessor.search.area.count)
            : '&nbsp;'
        }}
      </div>

      <v-card>
        <data-table-area
          :show-search="false"
          :items="$accessor.search.area.items"
          :count="$accessor.search.area.count"
          :options="$accessor.search.area.options"
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
import { mdiMapMarkerRadiusOutline } from '@mdi/js'
import SearchFormArea from '~/components/search/forms/SearchFormArea.vue'
import DataTableArea from '~/components/data-table/DataTableArea.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_AREA } from '~/constants'
import { useAccessor } from '~/composables/useAccessor'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'

const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)

export default defineComponent({
  components: {
    Search,
    DataTableArea,
    SearchFormArea,
    BaseHeader,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('area', {
        options: accessor.search.area.options,
        search: accessor.search.area.query,
        fields: getAPIFieldValues(HEADERS_AREA),
        searchFilters: {
          ...accessor.search.area.filters.byIds,
        },
      })
      accessor.search.area.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.area.SET_MODULE_COUNT({ count: response.count })
    })
    const filters = computed(() => accessor.search.area.filters.byIds)

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'area',
        qParamKey: 'areaQ',
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
      title: this.$t('area.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('area.pageTitle') as string,
        },
      ],
    }
  },
  computed: {
    icons(): any {
      return {
        mdiMapMarkerRadiusOutline,
      }
    },
  },
})
</script>
