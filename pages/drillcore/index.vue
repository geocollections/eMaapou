<template>
  <search>
    <template #title>
      <base-header
        :title="$t('drillcore.pageTitle').toString()"
        :icon="icons.mdiScrewMachineFlatTop"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-drillcore
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
          $accessor.search.drillcore.count
            ? $tc('common.count', $accessor.search.drillcore.count)
            : '&nbsp;'
        }}
      </div>
      <v-card>
        <data-table-drillcore
          :show-search="false"
          :items="$accessor.search.drillcore.items"
          :count="$accessor.search.drillcore.count"
          :options="$accessor.search.drillcore.options"
          :flat="false"
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
import { mdiScrewMachineFlatTop } from '@mdi/js'
import SearchFormDrillcore from '~/components/search/forms/SearchFormDrillcore.vue'
import DataTableDrillcore from '~/components/data-table/DataTableDrillcore.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_DRILLCORE } from '~/constants'
import { useAccessor } from '~/composables/useAccessor'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'
const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)
export default defineComponent({
  components: {
    Search,
    SearchFormDrillcore,
    DataTableDrillcore,
    BaseHeader,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('drillcore', {
        options: accessor.search.drillcore.options,
        search: accessor.search.drillcore.query,
        fields: getAPIFieldValues(HEADERS_DRILLCORE),
        searchFilters: {
          ...accessor.search.drillcore.filters,
          ...accessor.search.globalFilters,
        },
      })
      accessor.search.drillcore.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.drillcore.SET_MODULE_COUNT({ count: response.count })
    })
    const filters = computed(() => accessor.search.drillcore.filters)
    const globalFilters = computed(() => accessor.search.globalFilters)

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'drillcore',
        qParamKey: 'drillcoreQ',
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
      title: this.$t('drillcore.pageTitle') as string,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('drillcore.pageTitle') as string,
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
        mdiScrewMachineFlatTop,
      }
    },
  },
})
</script>
