<template>
  <attachment-table :search-field="{ key: 'sample', value: sample }" />
</template>

<script>
import AttachmentTable from '~/components/tables/AttachmentTable'

export default {
  components: { AttachmentTable },
  props: {
    sample: {
      type: Number,
      default: null,
    },
  },
}
</script>
