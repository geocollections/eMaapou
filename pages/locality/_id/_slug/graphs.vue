<template>
  <scatter-chart
    table-key="locality_id"
    :table-id="locality"
    :chart-title="chartTitle"
  />
</template>

<script>
import ScatterChart from '~/components/chart/ScatterChart'

export default {
  components: { ScatterChart },
  props: {
    locality: {
      type: Number,
      default: null,
    },
    localityObject: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    chartTitle() {
      return this.$translate({
        et: this?.localityObject?.locality,
        en: this?.localityObject?.locality_en,
      })
    },
  },
}
</script>
