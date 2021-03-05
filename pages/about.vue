<template>
  <div>
    <h1 class="text-center my-3">{{ $t('about.title') }}</h1>
    <v-card width="100%" flat tile class="indigo lighten-4">
      <v-card-text class="text-center">
        <div>Here be some information about e-Maapõu.</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: this.$t('about.pageTitle'),
    }
  },
}
</script>
