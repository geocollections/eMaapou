<template>
  <chart-taxon-pie
    table-key="sample"
    :table-id="$route.params.id.toString()"
    :chart-title="chartTitle"
    :taxon-data="taxons"
  />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import ChartTaxonPie from '~/components/chart/ChartTaxonPie.vue'

export default defineComponent({
  components: { ChartTaxonPie },
  props: {
    sampleObject: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      taxons: [] as any[],
    }
  },
  async fetch() {
    const resultsResponse = await this.$services.sarvREST.getResourceList(
      'taxon_list',
      {
        defaultParams: {
          sample: this.$route.params.id,
          fields: 'id,name,taxon,frequency',
          nest: 1,
        },
        options: {
          page: 1,
          itemsPerPage: 1000,
        },
      }
    )
    this.taxons = resultsResponse.items.map((item: any) => {
      return {
        value: item.frequency,
        name: item.taxon?.taxon ?? item.name,
      }
    })
  },
  computed: {
    chartTitle(): string {
      return `${this.$t('sample.number')} ${
        this.sampleObject?.number ||
        this.sampleObject?.number_additional ||
        this.sampleObject?.number_field ||
        this.sampleObject?.id
      }`
    },
  },
})
</script>
