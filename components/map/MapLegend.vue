<script>
export default {
  name: "MapLegend",
  props: {
    activeBaseLayer: {
      type: String,
      required: false,
      default: "",
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
      return this.activeBaseLayer === "Estonian map" ? "est-base" : false;
    },
    estHyb() {
      return this.activeOverlays.includes("Estonian hybrid") ? "est-hyb" : false;
    },
    maxHeight() {
      return this.height / 3;
    },
  },
};
</script>

<template>
  <VCard class="map-legend rounded" :style="{ maxHeight: `${maxHeight}px` }">
    <VCard v-if="estBase" flat>
      <VCardTitle class="font-weight-bold py-1 text-body-1">
        Estonian map
      </VCardTitle>
      <VImg :src="$img(`/map/${estBase}.png`, null, { provider: 'static' })" />
    </VCard>

    <VDivider />

    <VCard v-if="estHyb" flat>
      <VCardTitle class="font-weight-bold py-1 text-body-1">
        Estonian hybrid
      </VCardTitle>
      <VImg
        v-if="estHyb"
        :src="$img(`/map/${estHyb}.png`, null, { provider: 'static' })"
      />
    </VCard>
  </VCard>
</template>

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
