<template>
  <v-card
    flat
    tile
    class="mb-2 mt-4 mt-md-0"
    style="background-color: transparent"
  >
    <slot name="before"> </slot>
    <slot>
      <v-card-title
        style="word-break: normal"
        class="font-weight-medium text-h4 pt-0 px-0 pb-0 px-sm-3"
      >
        <v-icon left color="accent" large>
          {{ icon }}
        </v-icon>
        <slot name="title">
          {{ title }}
        </slot>
      </v-card-title>
    </slot>
  </v-card>
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
