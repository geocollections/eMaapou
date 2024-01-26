<template>
  <!-- <v-marker-cluster -->
  <!--   :options="{ spiderfyOnMaxZoom: false, disableClusteringAtZoom: 10 }" -->
  <!-- > -->
  <l-circle-marker-wrapper :markers="markers" />
  <!-- </v-marker-cluster> -->
</template>

<script setup lang="ts">
// import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import LCircleMarkerWrapper from "~/components/map/LCircleMarkerWrapper.vue";
// let Vue2LeafletMarkerCluster
// if (process.client) {
//   Vue2LeafletMarkerCluster = require('vue2-leaflet-markercluster')
// }

defineProps({
  markers: {
    type: Array,
    required: false,
    default() {
      return [];
    },
  },
});
</script>
