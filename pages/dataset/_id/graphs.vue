<template>
  <scatter-chart
    table-key="dataset_id"
    :table-id="dataset"
    :chart-title="chartTitle"
  />
</template>

<script>
import ScatterChart from '~/components/chart/ScatterChart'

export default {
  components: { ScatterChart },
  props: {
    dataset: {
      type: Number,
      default: null,
    },
    datasetObject: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    chartTitle() {
      return this.$translate({
        et: this?.datasetObject?.name,
        en: this?.datasetObject?.name_en,
      })
    },
  },
}
</script>
