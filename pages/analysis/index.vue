<template>
  <v-btn color="success" :to="localePath({ path: '/' })">
    Home <v-icon right small>mdi-home</v-icon>
  </v-btn>
</template>

<script>
export default {
  head() {
    return {
      title: this.$t('analysis.pageTitle'),
    }
  },
}
</script>
