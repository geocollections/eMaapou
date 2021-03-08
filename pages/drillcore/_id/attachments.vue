<template>
  <attachment-table
    :search-field="{ key: 'or_search', value: computedValue }"
  />
</template>

<script>
import AttachmentTable from '@/components/tables/AttachmentTable'

export default {
  components: { AttachmentTable },
  props: {
    locality: {
      type: Number,
      default: null,
    },
  },
  computed: {
    computedValue() {
      return `drillcore:${this.$route.params.id};locality:${this.locality}`
    },
  },
}
</script>
