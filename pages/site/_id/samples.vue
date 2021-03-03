<template>
  <sample-table :search-field="{ key: 'site_id', value: site }" />
</template>

<script>
import SampleTable from '@/components/tables/SampleTable'

export default {
  components: { SampleTable },
  props: {
    site: {
      type: Number,
      default: null,
    },
  },
}
</script>
