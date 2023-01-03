<template>
  <v-expansion-panel style="background-color: transparent" @change="handleOpen">
    <v-expansion-panel-header
      class="py-1 pl-2 pr-1 font-weight-medium"
      style="min-height: 40px; border-bottom: 1px solid lightgray"
    >
      Map
    </v-expansion-panel-header>
    <v-expand-transition>
      <div
        v-show="show"
        class="pa-0"
        style="border-bottom: 1px solid lightgray !important"
      >
        <map-search
          v-bind="$attrs"
          :markers="mapMarkers"
          :invalidate-size="show"
          activate-search
          gps-enabled
          :show-links="false"
          :gesture-handling="$vuetify.breakpoint.smAndDown"
          @update="$emit('update')"
        />
      </div>
    </v-expand-transition>
  </v-expansion-panel>
</template>

<script lang="ts">
import { mdiEarth } from '@mdi/js'
import {
  computed,
  defineComponent,
  PropType,
  ref,
  useContext,
  useRoute,
} from '@nuxtjs/composition-api'
import MapSearch from '~/components/map/MapSearch.vue'
import { MapMarker } from '~/types/map'
export default defineComponent({
  name: 'SearchMap',
  components: {
    MapSearch,
  },
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
    const show = ref(false)
    const icons = computed(() => {
      return {
        mdiEarth,
      }
    })

    const handleOpen = () => {
      show.value = !show.value
    }
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
    return { icons, mapMarkers, show, handleOpen }
  },
})
</script>

<style scoped>
::v-deep .v-expansion-panel-content__wrap {
  padding-right: 0px;
  padding-left: 0px;
  padding-bottom: 0px;
}
</style>
