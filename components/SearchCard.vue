<template>
  <v-card
    class="align-center d-flex"
    :class="`${cardClass}`"
    hover
    nuxt
    :height="height"
    :width="'100%'"
    :to="localePath({ name: href })"
  >
    <v-card-title class="montserrat text-none">
      {{ title }}
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'SearchCard',
  props: {
    title: {
      type: String,
      default: '',
    },
    altText: {
      type: String,
      default: '',
    },
    cardClass: {
      type: String,
      default: 'main',
    },
    href: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '90px',
    },
  },
}
</script>
