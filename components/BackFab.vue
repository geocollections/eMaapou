<template>
  <v-fab-transition>
    <v-btn
      :style="style"
      fab
      fixed
      left
      color="deep-orange darken-2"
      dark
      @click="$router.back()"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  name: 'BackFab',
  computed: {
    style() {
      return `top: ${this.$vuetify.application.top + 16}px; z-index: 4`
    },
  },
}
</script>
