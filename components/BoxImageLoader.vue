<template>
  <v-row
    class="ma-4 fill-height ma-0 grey lighten-3 rounded"
    align="center"
    justify="center"
    :style="`height: ${height}px; max-height: 30vh`"
  >
    <v-progress-circular
      size="70"
      color="grey lighten-5"
      :value="75"
      rotate="360"
      class="spin"
    />
  </v-row>
</template>

<script>
export default {
  name: 'BoxImageLoader',
  props: {
    height: {
      type: String,
      required: false,
      default: '400',
    },
  },
}
</script>

<style scoped>
.spin {
  -webkit-animation: spin 800ms linear infinite;
  -moz-animation: spin 800ms linear infinite;
  animation: spin 800ms linear infinite;
}

@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
