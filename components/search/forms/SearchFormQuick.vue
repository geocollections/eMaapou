<template>
  <v-form class="d-sm-flex text-right" @submit.prevent="$emit('submit')">
    <input-search v-model="query" height="56" />
    <v-btn
      height="56px"
      class="text-body-1 ml-3 mt-2 mt-sm-0"
      type="submit"
      color="warning"
      dark
    >
      <v-icon>mdi-magnify</v-icon>
      <div class="pl-2 montserrat text-capitalize">
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
