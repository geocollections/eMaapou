<template>
  <base-card-expand
    :active="active"
    :show-body="showMap"
    @click="showMap = $event"
  >
    <template #title>
      <v-icon left>{{ icons.mdiEarth }}</v-icon>
      <span class="montserrat" style="font-size: 1rem">{{
        $t('common.map')
      }}</span>
    </template>

    <template #body="{ showBody }">
      <map-search
        v-show="showBody"
        v-bind="$attrs"
        :markers="mapMarkers"
        :invalidate-size="showBody"
        activate-search
        gps-enabled
        rounded
        :show-links="false"
        :gesture-handling="$vuetify.breakpoint.smAndDown"
        @update="$emit('update')"
      />
    </template>
  </base-card-expand>
</template>

<script lang="ts">
import { mdiEarth } from '@mdi/js'
import { mapFields } from 'vuex-map-fields'
import {
  computed,
  defineComponent,
  PropType,
  useContext,
  useRoute,
} from '@nuxtjs/composition-api'
import BaseCardExpand from '../base/BaseCardExpand.vue'
import MapSearch from '~/components/map/MapSearch.vue'
import { MapMarker } from '~/types/map'
export default defineComponent({
  name: 'SearchMap',
  components: { MapSearch, BaseCardExpand },
  props: {
    items: {
      type: Array as PropType<any[]>,
      required: false,
      default: () => [],
    },
    useCustomMarkers: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { $translate } = useContext()
    const route = useRoute()
    const icons = computed(() => {
      return {
        mdiEarth,
      }
    })
    const mapMarkers = computed(() => {
      if (props.useCustomMarkers) return props.items

      const routeName = route.value.name?.split('___')[0]
      return props.items.reduce((filtered, item) => {
        if (item.latitude && item.longitude) {
          const newItem = {
            latitude: item.latitude,
            longitude: item.longitude,
            text:
              $translate({ et: item.locality, en: item.locality_en }) ??
              ($translate({
                et: item.site_name,
                en: item.site_name_en,
              }) ||
                item.name ||
                `ID: ${item.id}`),
            routeName:
              routeName === 'site'
                ? 'site'
                : item.site_id
                ? 'site'
                : 'locality',
            id: (item.locality_id || item.site_id) ?? item.id,
          } as MapMarker

          const isItemInArray = !!filtered.find(
            (existingItem: any) =>
              existingItem.latitude === item.latitude &&
              existingItem.longitude === item.longitude
          )
          if (!isItemInArray) filtered.push(newItem)
        }
        return filtered
      }, [])
    })
    return { icons, mapMarkers }
  },
  computed: {
    ...mapFields('settings', {
      showMap: 'showSearchViewMap',
    }),
  },
})
</script>
