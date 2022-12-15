<template>
  <div>
    <detail-error :error="error" />
  </div>
</template>

<script>
import DetailError from '~/components/DetailError.vue'
export default {
  components: { DetailError },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
}
</script>
