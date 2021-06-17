<template>
  <v-card
    flat
    tile
    class="mb-4 mt-4 mt-md-0"
    style="background-color: transparent"
  >
    <slot name="before"> </slot>
    <slot>
      <v-card-title
        style="word-break: normal"
        class="text-sm-h3 font-weight-bold text-h4 pt-0 px-0 px-sm-3"
      >
        <v-icon class="pr-2" x-large>{{ icon }}</v-icon>
        {{ title }}
      </v-card-title>
    </slot>
  </v-card>
  <!-- NOTE: Old implementation -->
  <!-- <v-card
    class="mb-4 d-flex justify-space-between px-4 flex-column flex-sm-row"
  >
    <div
      class="align-self-start align-self-sm-center text-no-wrap hidden-xs-only"
    >
      <slot name="left"></slot>
    </div>
    <slot>
      <div class="d-flex justify-center pt-2 text-center pb-4">
        <slot name="prepend">
          <v-icon v-if="icon" large left>{{ icon }}</v-icon>
        </slot>
        <div class="d-flex flex-column">
          <slot name="title">
            <h1>
              {{ title }}
            </h1>
          </slot>
          <slot name="subtitle">
            <h3 v-if="subtitle" class="grey--text text--darken-1">
              {{ subtitle }}
            </h3>
          </slot>
        </div>
        <slot name="append"> </slot>
      </div>
    </slot>
    <div
      class="align-self-end align-self-sm-center text-no-wrap hidden-xs-only"
    >
      <slot name="right"></slot>
    </div>
  </v-card> -->
</template>

<script>
export default {
  name: 'TitleCard',
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

<style scoped>
/* .v-card.v-sheet.theme--light {
  border-bottom: 5px solid red !important;
} */
</style>
