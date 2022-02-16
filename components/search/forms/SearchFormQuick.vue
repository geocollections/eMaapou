<template>
  <v-form
    class="d-flex text-right text-center"
    @submit.prevent="$emit('submit')"
  >
    <input-search v-model="query" />
    <v-btn height="48px" class="ml-3 mt-0" type="submit" color="warning" dark>
      <v-icon>mdi-magnify</v-icon>
      <div class="pl-2 montserrat">
        {{ $t('common.searchCommand') }}
      </div>
    </v-btn>
  </v-form>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import InputSearch from '~/components/input/InputSearch.vue'

export default {
  name: 'SearchFromQuick',
  components: { InputSearch },
  props: {
    onlyIcon: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapFields('search', { query: 'query' }),
  },
}
</script>
