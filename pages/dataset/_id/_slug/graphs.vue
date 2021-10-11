<template>
  <line-chart-multi
    table-key="dataset_id"
    :table-id="$route.params.id.toString()"
    :chart-title="chartTitle"
  />
</template>

<script>
import LineChartMulti from '~/components/chart/types/LineChartMulti'

export default {
  components: { LineChartMulti },
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
