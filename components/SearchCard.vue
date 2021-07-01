<template>
  <v-chip
    class="pa-4 align-center d-flex font-weight-bold"
    :class="`${cardClass}`"
    hover
    nuxt
    style="background-color: white"
    :height="height"
    :width="'100%'"
    :to="to"
  >
    <div class="montserrat text-none">
      {{ title }}
    </div>
  </v-chip>
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
    to: {
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
