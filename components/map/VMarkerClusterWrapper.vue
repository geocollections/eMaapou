<template>
  <v-marker-cluster
    :options="{ spiderfyOnMaxZoom: false, disableClusteringAtZoom: 10 }"
  >
    <l-circle-marker-wrapper :markers="markers" />
  </v-marker-cluster>
</template>

<script>
import LCircleMarkerWrapper from '~/components/map/LCircleMarkerWrapper'
export default {
  name: 'VMarkerClusterWrapper',
  components: { LCircleMarkerWrapper },
  props: {
    markers: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
  },
}
</script>

<style scoped></style>
