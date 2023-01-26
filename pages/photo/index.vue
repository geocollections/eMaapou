<template>
  <search>
    <template #title>
      <header-search
        :title="$t('photo.pageTitle').toString()"
        :count="$accessor.search.image.count"
        :icon="icons.mdiFileImageOutline"
      />
    </template>

    <template #form="{ closeMobileSearch }">
      <search-form-photo
        :markers="mapMarkers"
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
        <v-tab
          v-for="view in views"
          :key="view"
          active-class="active-tab"
          class="montserrat text-capitalize"
        >
          {{ $t(`common.${view}`) }}
        </v-tab>
      </v-tabs>
      <v-card class="mt-0">
        <v-tabs-items v-model="currentView">
          <v-tab-item :value="0">
            <data-table-photo
              flat
              :show-search="false"
              :items="$accessor.search.image.items"
              :count="$accessor.search.image.count"
              :options="$accessor.search.image.options"
              dynamic-headers
              stateful-headers
              :is-loading="$fetchState.pending"
              @update="handleDataTableUpdate"
            />
          </v-tab-item>
          <v-tab-item :value="1">
            <image-view
              :items="$accessor.search.image.items"
              :count="$accessor.search.image.count"
              :options="$accessor.search.image.options"
              @update="handleDataTableUpdate"
            />
          </v-tab-item>
          <v-tab-item :value="2">
            <gallery-view
              :items="$accessor.search.image.items"
              :count="$accessor.search.image.count"
              :options="$accessor.search.image.options"
              @update="handleDataTableUpdate"
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
  useContext,
  useMeta,
  useRoute,
  // ref,
} from '@nuxtjs/composition-api'
import { mdiFileImageOutline } from '@mdi/js'
import HeaderSearch from '~/components/HeaderSearch.vue'
import Search from '~/templates/Search.vue'
import SearchFormPhoto from '~/components/search/forms/SearchFormPhoto.vue'
import DataTablePhoto from '~/components/data-table/DataTablePhoto.vue'
import ImageView from '~/components/ImageView.vue'
import GalleryView from '~/components/GalleryView.vue'
import { HEADERS_PHOTO } from '~/constants'
import { useSearchQueryParams } from '~/composables/useSearchQueryParams'
import { FilterType, LookupType } from '~/types/enums'
import { Filter } from '~/types/filters'

const useServices = wrapProperty('$services', false)
const useGetAPIFieldValues = wrapProperty('$getAPIFieldValues', false)

export default defineComponent({
  components: {
    GalleryView,
    ImageView,
    DataTablePhoto,
    SearchFormPhoto,
    Search,
    HeaderSearch,
  },
  setup() {
    const { $accessor, $translate, i18n } = useContext()
    const route = useRoute()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('attachment', {
        options: $accessor.search.image.options,
        search: $accessor.search.image.query,
        fields: getAPIFieldValues(HEADERS_PHOTO),
        searchFilters: {
          ...$accessor.search.image.filters,
          ...$accessor.search.globalFilters,
          specimenImageAttachment: {
            value: '2',
            type: FilterType.Text,
            lookUpType: LookupType.Equals,
            fields: ['specimen_image_attachment'],
          } as Filter,
        },
      })
      $accessor.search.image.SET_MODULE_ITEMS({ items: response.items })
      $accessor.search.image.SET_MODULE_COUNT({ count: response.count })
    })

    const filters = computed(() => $accessor.search.image.filters)
    const globalFilters = computed(() => $accessor.search.globalFilters)
    const views = computed(() => ['table', 'image', 'gallery'])

    const currentView = computed({
      get: () => $accessor.search.image.currentView,
      set: (val) => $accessor.search.image.setView(val),
    })
    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'image',
        qParamKey: 'photoQ',
        filters,
        globalFilters,
        fetch,
      })
    const icons = computed(() => ({ mdiFileImageOutline }))
    const mapMarkers = computed(() => {
      if ($accessor.search.image.items?.length > 0) {
        return $accessor.search.image.items.reduce(
          (filtered: any[], item: any) => {
            if (
              (item.latitude && item.longitude) ||
              (item.image_latitude && item.image_latitude)
            ) {
              const newItem = {
                latitude: item.image_latitude ?? item.latitude,
                longitude: item.image_longitude ?? item.longitude,
                text:
                  ($translate({
                    et: item.locality,
                    en: item.locality_en,
                  }) ||
                    item.image_object) ??
                  `ID: ${item.id}`,
                routeName: item.locality_id ? 'locality' : 'photo',
                id: item.locality_id ?? item.id,
              }

              const isItemInArray = !!filtered.find(
                (existingItem) =>
                  existingItem.latitude === newItem.latitude &&
                  existingItem.longitude === newItem.longitude
              )
              if (!isItemInArray) filtered.push(newItem)
            }
            return filtered
          },
          []
        )
      }
      return []
    })

    useMeta(() => ({
      title: i18n.t('photo.pageTitle').toString(),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: i18n.t('photo.pageTitle').toString(),
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: route.value.path,
        },
      ],
    }))

    return {
      handleFormReset,
      handleFormUpdate,
      handleDataTableUpdate,
      views,
      currentView,
      icons,
      mapMarkers,
    }
  },
  head: {},
})
</script>

<style scoped lang="scss">
.active-tab {
  // font-weight: bold;
  color: var(--v-accent-darken1) !important;
  &::before {
    opacity: 0.2 !important;
    background-color: var(--v-accent-base) !important;

    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}
</style>
