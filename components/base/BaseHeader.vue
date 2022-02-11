<template>
  <v-card
    flat
    tile
    class="mb-6 mt-4 mt-md-0 title-border"
    style="background-color: transparent"
  >
    <slot name="before"> </slot>
    <slot>
      <v-card-title
        style="word-break: normal"
        class="text-sm-h3 font-weight-medium text-h4 pt-0 px-0 pb-6 px-sm-3"
      >
        <v-icon
          v-show="$vuetify.breakpoint.smAndUp"
          class="pr-sm-2"
          color="accent darken-2"
          large
        >
          {{ icon }}
        </v-icon>
        {{ title }}
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
