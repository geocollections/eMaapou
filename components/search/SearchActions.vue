<template>
  <v-card
    flat
    tile
    color="transparent"
    class="mt-2 d-flex justify-end align-center"
  >
    <reset-search-button @click="$emit('click')" />
    <search-button />
  </v-card>
</template>

<script>
import ResetSearchButton from '~/components/search/ResetSearchButton.vue'
import SearchButton from '~/components/search/SearchButton.vue'

export default {
  name: 'SearchActions',
  components: {
    ResetSearchButton,
    SearchButton,
  },
  props: {
    count: {
      type: Number,
      default: 0,
    },
  },
}
</script>
