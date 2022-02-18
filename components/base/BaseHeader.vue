<template>
  <v-card
    flat
    tile
    class="mb-6 mt-4 mt-md-0"
    style="background-color: transparent"
  >
    <slot name="before"> </slot>
    <slot>
      <v-card-title
        style="word-break: normal; color: #577daf"
        class="text-md-h4 font-weight-bold text-h4 pt-0 px-0 pb-6 px-sm-3"
      >
        <v-icon
          v-show="$vuetify.breakpoint.smAndUp"
          class="pr-sm-2"
          color="accent"
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

<style lang="scss" scoped>
.v-card {
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--v-accent-base);
    height: 4px;
    border-radius: 2px 2px 2px 2px;
  }
}
</style>
