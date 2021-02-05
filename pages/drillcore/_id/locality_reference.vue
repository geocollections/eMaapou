<template>
  <v-data-table
    :headers="headers"
    :items="localityReferences"
    :items-per-page="5"
  >
    <template #item.reference="{ item }">
      <a
        :href="`https://geoloogia.info/reference/${item.reference}`"
        class="text-link"
        >{{ item.reference__reference }}</a
      >
    </template>
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
      headers: [
        { text: this.$t('localityReference.reference'), value: 'reference' },
        { text: this.$t('localityReference.remarks'), value: 'remarks' },
        { text: this.$t('localityReference.pages'), value: 'pages' },
      ],
      localityReferences: [],
    }
  },
  async fetch() {
    const localityReferenceResponse = await this.$axios.$get(
      `https://api.geocollections.info/locality_reference/?locality=${this.locality}`
    )
    this.localityReferences = localityReferenceResponse.results
  },
  created() {
    console.log(this.locality)
  },
}
</script>
