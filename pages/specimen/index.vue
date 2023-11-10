<template>
  <search>
    <template #title>
      <header-search
        :title="$t('specimen.pageTitle').toString()"
        :count="$accessor.search.specimen.count"
        :icon="icons.mdiBug"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-specimen
        :result-view="views[currentView]"
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
      <v-tabs
        v-model="currentView"
        background-color="transparent"
        color="accent"
      >
        <v-tab active-class="active-tab" class="montserrat text-capitalize">
          {{ $t(`common.table`) }}
        </v-tab>
        <v-tab
          :disabled="imageCount < 1"
          active-class="active-tab"
          class="montserrat text-capitalize"
        >
          {{ $t(`common.image`) }}
          <v-chip class="ml-2" small>{{ imageCount }}</v-chip>
        </v-tab>
      </v-tabs>
      <v-card class="mt-0">
        <v-tabs-items v-model="currentView">
          <v-tab-item :value="0">
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
          </v-tab-item>
          <v-tab-item :value="1">
            <specimen-image-view
              :items="imageItems"
              :count="imageCount"
              :options="$accessor.search.specimen.options"
              @update="handleImagesUpdate"
            />
          </v-tab-item>
        </v-tabs-items>
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
  ref,
} from '@nuxtjs/composition-api'
import { mdiBug } from '@mdi/js'
import SearchFormSpecimen from '~/components/search/forms/SearchFormSpecimen.vue'
import DataTableSpecimen from '~/components/data-table/DataTableSpecimen.vue'
import Search from '~/templates/Search.vue'
import HeaderSearch from '~/components/HeaderSearch.vue'
import SpecimenImageView from '~/components/SpecimenImageView.vue'
import { HEADERS_SPECIMEN } from '~/constants'
import { useAccessor } from '~/composables/useAccessor'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'

const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)
export default defineComponent({
  components: {
    SpecimenImageView,
    Search,
    SearchFormSpecimen,
    DataTableSpecimen,
    HeaderSearch,
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
          ...accessor.search.specimen.filters,
          ...accessor.search.globalFilters,
        },
      })
      accessor.search.specimen.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.specimen.SET_MODULE_COUNT({ count: response.count })
    })

    const imageItems = ref([])
    const imageCount = ref(0)
    const { fetch: fetchSpecimenImages } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList(
        'specimen_image',
        {
          options: accessor.search.specimen.options,
          search: accessor.search.specimen.query,
          fields: getAPIFieldValues(HEADERS_SPECIMEN),
          searchFilters: {
            ...accessor.search.specimen.filters,
            ...accessor.search.globalFilters,
          },
        }
      )
      imageItems.value = response.items
      imageCount.value = response.count
    })
    const filters = computed(() => accessor.search.specimen.filters)
    const globalFilters = computed(() => accessor.search.globalFilters)
    const views = computed(() => ['table', 'image'])

    const currentView = ref(0)
    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'specimen',
        qParamKey: 'specimenQ',
        filters,
        globalFilters,
        fetch,
      })
    const { handleDataTableUpdate: handleImagesUpdate } = useSearchQueryParams({
      module: 'specimen',
      qParamKey: 'specimenQ',
      filters,
      globalFilters,
      fetch: fetchSpecimenImages,
    })
    return {
      currentView,
      views,
      handleFormReset,
      handleFormUpdate,
      handleDataTableUpdate,
      handleImagesUpdate,
      imageItems,
      imageCount,
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
        mdiBug,
      }
    },
  },
  watch: {
    currentView: {
      handler() {
        this.handleFormUpdate()
      },
    },
  },
})
</script>
