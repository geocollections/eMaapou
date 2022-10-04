<template>
  <v-marker-cluster
    :options="{ spiderfyOnMaxZoom: false, disableClusteringAtZoom: 10 }"
  >
    <l-circle-marker-wrapper :markers="markers" />
  </v-marker-cluster>
</template>

<script>
export default {
  name: 'VMarkerClusterWrapper',
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
