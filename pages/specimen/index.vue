<template>
  <search>
    <template #title>
      <base-header
        :title="$t('specimen.pageTitle')"
        :icon="icons.mdiMicroscope"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-specimen
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
          $accessor.search.specimen.count
            ? $tc('common.count', $accessor.search.specimen.count)
            : '&nbsp;'
        }}
      </div>

      <v-card>
        <data-table-specimen
          :show-search="false"
          :items="$accessor.search.specimen.items"
          :count="$accessor.search.specimen.count"
          :options="$accessor.search.specimen.options"
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
import { mdiMicroscope } from '@mdi/js'
import SearchFormSpecimen from '~/components/search/forms/SearchFormSpecimen.vue'
import DataTableSpecimen from '~/components/data-table/DataTableSpecimen.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_SPECIMEN } from '~/constants'
import { useAccessor } from '~/composables/useAccessor'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'

const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)
export default defineComponent({
  components: {
    Search,
    SearchFormSpecimen,
    DataTableSpecimen,
    BaseHeader,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('specimen', {
        options: accessor.search.specimen.options,
        search: accessor.search.specimen.query,
        fields: getAPIFieldValues(HEADERS_SPECIMEN),
        searchFilters: {
          ...accessor.search.specimen.filters.byIds,
          ...accessor.search.globalFilters.byIds,
        },
      })
      accessor.search.specimen.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.specimen.SET_MODULE_COUNT({ count: response.count })
    })
    const filters = computed(() => accessor.search.specimen.filters.byIds)
    const globalFilters = computed(() => accessor.search.globalFilters.byIds)

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'specimen',
        qParamKey: 'specimenQ',
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
      title: this.$t('specimen.pageTitle').toString(),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('specimen.pageTitle').toString(),
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
        mdiMicroscope,
      }
    },
  },
})
</script>
