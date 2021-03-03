<template>
  <attachment-table
    :search-field="{ key: 'or_search', value: computedValue }"
  />
</template>

<script>
import AttachmentTable from '@/components/tables/AttachmentTable'
export default {
  components: { AttachmentTable },
  computed: {
    computedValue() {
      return `locality:${this.$route.params.id}`
    },
  },
}
</script>
