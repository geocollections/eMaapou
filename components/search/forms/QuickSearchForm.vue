<template>
  <v-form
    class="d-sm-flex text-right text-sm-center"
    @submit.prevent="$emit('submit')"
  >
    <query-search-field v-model="query" />
    <v-btn
      height="48px"
      class="ml-3 mt-2 mt-sm-0"
      type="submit"
      color="warning"
      dark
    >
      <v-icon>mdi-magnify</v-icon>
      <div class="pl-2 montserrat">
        {{ $t('common.searchCommand') }}
      </div>
    </v-btn>
  </v-form>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import QuerySearchField from '~/components/fields/QuerySearchField.vue'

export default {
  name: 'QuickSearchForm',
  components: { QuerySearchField },
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
