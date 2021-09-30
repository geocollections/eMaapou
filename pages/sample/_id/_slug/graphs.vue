<template>
  <pie-chart
    table-key="sample"
    :table-id="$route.params.id.toString()"
    :chart-title="chartTitle"
  />
</template>

<script>
import PieChart from '~/components/chart/types/PieChart'

export default {
  components: { PieChart },
  props: {
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
