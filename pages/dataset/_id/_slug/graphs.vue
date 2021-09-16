<template>
  <scatter-chart
    table-key="dataset_id"
    :table-id="$route.params.id"
    :chart-title="chartTitle"
  />
</template>

<script>
import ScatterChart from '~/components/chart/ScatterChart'

export default {
  components: { ScatterChart },
  props: {
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
