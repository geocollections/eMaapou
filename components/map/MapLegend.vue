<template>
  <v-card class="map-legend rounded" :style="{ maxHeight: `${maxHeight}px` }">
    <v-card v-if="estBase" flat>
      <v-card-title class="font-weight-bold py-1 text-body-1"
        >Estonian map</v-card-title
      >
      <v-img :src="require(`~/assets/map/${estBase}.png`)" />
    </v-card>

    <v-divider />

    <v-card v-if="estHyb" flat>
      <v-card-title class="font-weight-bold py-1 text-body-1"
        >Estonian hybrid</v-card-title
      >
      <v-img v-if="estHyb" :src="require(`~/assets/map/${estHyb}.png`)" />
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: 'MapLegend',
  props: {
    activeBaseLayer: {
      type: String,
      required: false,
      default: '',
    },
    activeOverlays: {
      type: Array,
      required: false,
      default: () => [],
    },
    height: {
      type: Number,
      required: false,
      default: 150,
    },
  },
  computed: {
    estBase() {
      return this.activeBaseLayer === 'Estonian map' ? 'est-base' : false
    },
    estHyb() {
      return this.activeOverlays.includes('Estonian hybrid') ? 'est-hyb' : false
    },
    maxHeight() {
      return this.height / 3
    },
  },
}
</script>

<style scoped>
.map-legend {
  position: absolute;
  bottom: 26px;
  right: 10px;
  z-index: 999;
  background: rgba(255, 255, 255, 0.7);
  opacity: 0.8;
  overflow-y: auto;
}
</style>
