<template>
  <div class="mt-md-0" style="background-color: transparent">
    <slot name="before"> </slot>
    <slot>
      <div
        style="word-break: normal"
        class="montserrat d-flex align-center font-weight-medium text-h4 pt-0 pr-3 pb-0"
      >
        <v-icon v-if="icon.length > 0" left color="accent" large>
          {{ icon }}
        </v-icon>
        <slot name="title">
          {{ title }}
        </slot>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'BaseHeader',
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
}
</script>
