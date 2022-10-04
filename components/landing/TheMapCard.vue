<template>
  <leaflet-map
    class="elevation-3"
    height="450px"
    summary-overlay
    :invalidate-size="showMap"
    :zoom="6"
    rounded
    :show-links="false"
    :gesture-handling="false"
  />
</template>

<script>
export default {
  name: 'TheMapCard',
  props: {
    showMap: {
      type: Boolean,
      require: true,
    },
  },
}
</script>
