<template>
  <v-data-table :headers="headers" :items="localityDescriptions">
  </v-data-table>
</template>

<script>
export default {
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      headers: ['id'],
      localityDescriptions: [],
    }
  },
  async fetch() {
    const localityDescriptionResponse = await this.$axios.$get(
      `https://api.geocollections.info/locality_description/?locality=${this.locality}`
    )
    this.localityDescriptions = localityDescriptionResponse.results
  },
}
</script>
