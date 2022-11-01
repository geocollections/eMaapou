<template>
  <search>
    <template #title>
      <base-header
        :title="$t('site.pageTitle')"
        :icon="icons.mdiMapMarkerStarOutline"
      />
    </template>

    <template #form>
      <search-form-site @update="handleFormUpdate" @reset="handleFormReset" />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{
          $accessor.search.site.count
            ? $tc('common.count', $accessor.search.site.count)
            : '&nbsp;'
        }}
      </div>

      <v-card>
        <data-table-site
          :show-search="false"
          :items="$accessor.search.site.items"
          :count="$accessor.search.site.count"
          :options="$accessor.search.site.options"
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
import { mdiMapMarkerStarOutline } from '@mdi/js'
import SearchFormSite from '~/components/search/forms/SearchFormSite.vue'
import DataTableSite from '~/components/data-table/DataTableSite.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { HEADERS_SITE } from '~/constants'
import { useAccessor } from '~/composables/useAccessor'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'

const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)
export default defineComponent({
  components: {
    Search,
    SearchFormSite,
    DataTableSite,
    BaseHeader,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('site', {
        options: accessor.search.site.options,
        search: accessor.search.site.query,
        fields: getAPIFieldValues(HEADERS_SITE),
        searchFilters: {
          ...accessor.search.site.filters.byIds,
          ...accessor.search.globalFilters.byIds,
        },
      })
      accessor.search.site.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.site.SET_MODULE_COUNT({ count: response.count })
    })
    const filters = computed(() => accessor.search.site.filters.byIds)
    const globalFilters = computed(() => {
      return {
        geoJSON: accessor.search.globalFilters.byIds.geoJSON,
      }
    })

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'site',
        qParamKey: 'siteQ',
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
      title: this.$t('site.pageTitle').toString(),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('site.pageTitle').toString(),
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
        mdiMapMarkerStarOutline,
      }
    },
  },
})
</script>
