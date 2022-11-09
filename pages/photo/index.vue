<template>
  <search>
    <template #title>
      <base-header
        :title="$t('photo.pageTitle')"
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
      <div class="py-1 pl-2 text-h6">
        {{
          $accessor.search.image.count
            ? $tc('common.count', $accessor.search.image.count)
            : '&nbsp;'
        }}
      </div>
      <v-card class="mt-0">
        <v-radio-group
          v-model="currentView"
          row
          dense
          hide-details
          class="mt-0 px-4 pt-3 pb-2"
          mandatory
        >
          <v-radio
            v-for="entity in listOfViews"
            :key="entity"
            class="montserrat"
            :label="$t(`common.${entity}`)"
            :value="entity"
            color="header"
          ></v-radio>
        </v-radio-group>

        <data-table-photo
          v-if="currentView === 'table'"
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

        <image-view
          v-if="currentView === 'image'"
          :items="$accessor.search.image.items"
          :count="$accessor.search.image.count"
          :options="$accessor.search.image.options"
          @update="handleDataTableUpdate"
        />

        <gallery-view
          v-if="currentView === 'gallery'"
          :items="$accessor.search.image.items"
          :count="$accessor.search.image.count"
          :options="$accessor.search.image.options"
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
import { mdiFileImageOutline } from '@mdi/js'
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import BaseHeader from '~/components/base/BaseHeader.vue'
import Search from '~/templates/Search.vue'
import SearchFormPhoto from '~/components/search/forms/SearchFormPhoto.vue'
import DataTablePhoto from '~/components/data-table/DataTablePhoto.vue'
import ImageView from '~/components/ImageView.vue'
import GalleryView from '~/components/GalleryView.vue'
import { useAccessor } from '~/composables/useAccessor'
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
    BaseHeader,
  },
  setup() {
    const accessor = useAccessor()
    const services = useServices()
    const getAPIFieldValues = useGetAPIFieldValues()
    const { fetch } = useFetch(async () => {
      const response = await services.sarvSolr.getResourceList('attachment', {
        options: accessor.search.image.options,
        search: accessor.search.image.query,
        fields: getAPIFieldValues(HEADERS_PHOTO),
        searchFilters: {
          ...accessor.search.image.filters.byIds,
          ...accessor.search.globalFilters.byIds,
          specimenImageAttachment: {
            value: '2',
            type: FilterType.Text,
            lookUpType: LookupType.Equals,
            fields: ['specimen_image_attachment'],
          } as Filter,
        },
      })
      accessor.search.image.SET_MODULE_ITEMS({ items: response.items })
      accessor.search.image.SET_MODULE_COUNT({ count: response.count })
    })
    const filters = computed(() => accessor.search.image.filters.byIds)
    const globalFilters = computed(() => accessor.search.globalFilters.byIds)

    const { handleFormReset, handleFormUpdate, handleDataTableUpdate } =
      useSearchQueryParams({
        module: 'image',
        qParamKey: 'photoQ',
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
      title: this.$t('photo.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('photo.pageTitle') as string,
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
    ...mapState('settings', ['listOfViews']),
    ...mapFields('search/image', {
      currentView: 'currentView',
    }),
    icons(): any {
      return {
        mdiFileImageOutline,
      }
    },
    mapMarkers(): any {
      if (this.$accessor.search.image.items?.length > 0) {
        return this.$accessor.search.image.items.reduce(
          (filtered: any[], item: any) => {
            if (
              (item.latitude && item.longitude) ||
              (item.image_latitude && item.image_latitude)
            ) {
              const newItem = {
                latitude: item.image_latitude ?? item.latitude,
                longitude: item.image_longitude ?? item.longitude,
                text:
                  (this.$translate({
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
    },
  },
})
</script>
