<template>
  <div>
    <div class="text-caption">Renderer</div>
    <v-btn-toggle
      dense
      color="accent"
      :value="renderer"
      @change="$emit('update', $event)"
    >
      <v-btn
        width="65"
        small
        class="text-none montserrat"
        :outlined="renderer !== 'canvas'"
        value="canvas"
      >
        Canvas
      </v-btn>
      <v-btn
        width="65"
        small
        class="text-none montserrat"
        :outlined="renderer !== 'svg'"
        value="svg"
      >
        SVG
      </v-btn>
    </v-btn-toggle>
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
