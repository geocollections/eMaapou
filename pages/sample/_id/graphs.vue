<template>
  <scatter-chart
    table-key="sample_id"
    :table-id="sample"
    :chart-title="chartTitle"
  />
</template>

<script>
import ScatterChart from '~/components/chart/ScatterChart'

export default {
  components: { ScatterChart },
  props: {
    sample: {
      type: Number,
      default: null,
    },
    sampleObject: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    chartTitle() {
      return `${this.$t('sample.number')} ${
        this.sampleObject?.number ||
        this.sampleObject?.number_additional ||
        this.sampleObject?.number_field ||
        this.sampleObject?.id
      }`
    },
  },
}
</script>
