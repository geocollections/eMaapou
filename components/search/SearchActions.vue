<template>
  <v-card
    flat
    tile
    color="transparent"
    class="mt-2 mr-2 d-flex justify-end align-center"
  >
    <search-reset-button @click="$emit('click')" />
    <search-button />
  </v-card>
</template>

<script>
import SearchResetButton from '~/components/search/SearchResetButton.vue'
import SearchButton from '~/components/search/SearchButton.vue'

export default {
  name: 'SearchActions',
  components: {
    SearchResetButton,
    SearchButton,
  },
}
</script>
