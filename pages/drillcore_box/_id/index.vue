<template>
  <sample-table :search-field="{ key: 'locality_id', value: computedValue }" />
</template>

<script>
import SampleTable from '@/components/tables/SampleTable'

export default {
  components: { SampleTable },
  props: {
    locality: {
      type: Number,
      default: null,
    },
    depthStart: {
      type: Number,
      default: null,
    },
    depthEnd: {
      type: Number,
      default: null,
    },
  },
  computed: {
    computedValue() {
      return `${this.locality} AND (depth:[${this.depthStart} TO ${this.depthEnd}] OR depth_interval:[${this.depthStart} TO ${this.depthEnd}])`
    },
  },
}
</script>
