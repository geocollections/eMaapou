<template>
  <leaflet-map
    class="ml-4 elevation-3"
    height="70vh"
    summary-overlay
    :invalidate-size="showMap"
    :zoom="6"
    rounded
    :show-links="false"
    :gesture-handling="false"
  />
</template>

<script>
import LeafletMap from '~/components/map/LeafletMap.vue'

export default {
  name: 'TheMapCard',
  components: {
    LeafletMap,
  },
  props: {
    showMap: {
      type: Boolean,
      require: true,
    },
  },
}
</script>
