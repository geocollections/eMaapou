<template>
  <flog
    table-key="dataset_id"
    :table-id="$route.params.id.toString()"
    :chart-title="chartTitle"
  />
</template>

<script>
import Flog from '~/components/chart/Flog'

export default {
  components: { Flog },
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
