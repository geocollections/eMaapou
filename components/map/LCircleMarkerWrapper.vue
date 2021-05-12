<template>
  <div>
    <!-- TODO: Click event should be stopped in order to propagate wms layer click. Some solutions were applied but without results -->
    <l-circle-marker
      v-for="(marker, idx) in markers"
      :key="`marker-${idx}-lat-${marker.latitude}-lon-${marker.latitude}`"
      :lat-lng="[marker.latitude, marker.longitude]"
      :radius="6"
      :weight="2"
      color="#fff"
      fill-color="red"
      :fill-opacity="0.9"
      @click="
        marker.id && marker.routeName
          ? $router.push(
              localePath({
                name: `${marker.routeName}-id`,
                params: { id: marker.id },
              })
            )
          : ''
      "
    >
      <l-tooltip v-if="marker.text" :options="tooltipOptions">{{
        marker.text
      }}</l-tooltip>
    </l-circle-marker>
  </div>
</template>

<script>
export default {
  name: 'LCircleMarkerWrapper',
  props: {
    markers: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
  },
  computed: {
    tooltipOptions() {
      return {
        permanent: this.markers.length <= 5,
        direction: 'top',
        offset: [1, -7],
      }
    },
  },
}
</script>

<style scoped></style>
