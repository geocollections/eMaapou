<template>
  <div class="d-flex flex-row px-4">
    <v-btn
      width="75"
      small
      class="mb-2 rounded-r-0 rounded-l"
      color="accent"
      :outlined="renderer !== 'canvas'"
      @click="$emit('update', 'canvas')"
      >Canvas</v-btn
    >
    <v-btn
      width="75"
      small
      class="mb-2 rounded-l-0 rounded-r"
      color="accent"
      :outlined="renderer !== 'svg'"
      @click="$emit('update', 'svg')"
      >SVG</v-btn
    >
  </div>
</template>

<script>
export default {
  name: 'RendererSwitch',
  props: {
    renderer: {
      type: String,
      default: 'canvas',
      required: true,
    },
  },
}
</script>

<style scoped></style>
