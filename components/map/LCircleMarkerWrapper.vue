<template>
  <div>
    <l-circle-marker
      v-for="(marker, idx) in markers"
      :key="`marker-${idx}-lat-${marker.latitude}-lon-${marker.latitude}`"
      :lat-lng="[marker.latitude, marker.longitude]"
      :radius="6"
      :weight="1.5"
      color="#fff"
      :fill-color="$vuetify.theme.currentTheme.warning"
      :fill-opacity="1"
      @click="handleClick($event, marker)"
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
  methods: {
    handleClick(event, marker) {
      this.$L.DomEvent.stopPropagation(event)
      if (marker.id && marker.routeName) {
        this.$router.push(
          this.localePath({
            name: `${marker.routeName}-id`,
            params: { id: marker.id },
          })
        )
      }
    },
  },
}
</script>

<style scoped></style>
