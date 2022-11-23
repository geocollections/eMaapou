<template>
  <div>
    <div class="text-caption" v-text="$t('common.render')" />
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

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { Renderer } from '~/types/enums'
export default defineComponent({
  name: 'RendererSwitch',
  props: {
    renderer: {
      type: String,
      default: Renderer.Canvas,
      required: true,
    },
  },
})
</script>

<style scoped></style>
