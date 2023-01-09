<template>
  <v-expansion-panel style="background-color: transparent" @change="handleOpen">
    <v-expansion-panel-header
      class="py-1 pl-2 pr-1 font-weight-medium"
      style="min-height: 40px; border-bottom: 1px solid lightgray"
    >
      {{ $t('filters.map') }}
    </v-expansion-panel-header>
    <div
      v-if="value !== null"
      class="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <div class="d-flex py-1 px-2">
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.prevent.stop="handleRemove"
          />
        </span>
        <span
          class="align-self-center pl-2 text-body-2 font-weight-medium text-truncate"
        >
          {{ valueString }}
        </span>
      </div>
    </div>
    <v-expand-transition>
      <div
        v-show="show"
        class="pa-0"
        style="border-bottom: 1px solid lightgray !important"
      >
        <map-search
          v-bind="$attrs"
          :value="value"
          :markers="mapMarkers"
          :invalidate-size="show"
          activate-search
          gps-enabled
          :show-links="false"
          height="350px"
          :gesture-handling="$vuetify.breakpoint.smAndDown"
          @update="$emit('update')"
          @input="$emit('input', $event)"
        />
      </div>
    </v-expand-transition>
  </v-expansion-panel>
</template>

<script lang="ts">
import { mdiEarth, mdiClose } from '@mdi/js'
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
  name: 'FilterMap',
  components: {
    MapSearch,
  },
  props: {
    items: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    useCustomMarkers: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object as PropType<any>,
      default: () => null,
    },
  },
  setup(props, { emit }) {
    const { $translate } = useContext()
    const route = useRoute()
    const show = ref(false)
    const icons = computed(() => {
      return {
        mdiEarth,
        mdiClose,
      }
    })

    const handleOpen = () => {
      show.value = !show.value
    }
    const handleRemove = () => {
      emit('input', null)
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
    const valueString = computed(() => {
      return `${props.value.geometry.type} ${props.value.geometry.coordinates}`
    })
    return { icons, mapMarkers, show, handleOpen, handleRemove, valueString }
  },
})
</script>

<style scoped>
::v-deep .v-expansion-panel-content__wrap {
  padding-right: 0px;
  padding-left: 0px;
  padding-bottom: 0px;
}
.checkbox {
  accent-color: var(--v-accent-base);
}
</style>
