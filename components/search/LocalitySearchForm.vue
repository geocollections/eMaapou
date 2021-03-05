<template>
  <v-form>
    <global-search />
    <v-btn @click="handleSearch"> Search </v-btn>
    <text-search-field v-model="name" :label="$t(search.byIds.name.label)" />

    <text-search-field
      v-model="country"
      :label="$t(search.byIds.country.label)"
    />
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import GlobalSearch from './GlobalSearch.vue'
import TextSearchField from './TextSearchField.vue'

export default {
  name: 'LocalitySearchForm',
  components: { TextSearchField, GlobalSearch },
  computed: {
    ...mapState(['isDrawerOpen']),
    ...mapState('locality', ['search']),
    ...mapFields('locality', {
      name: 'search.byIds.name.value',
      country: 'search.byIds.country.value',
    }),
  },
  methods: {
    ...mapActions('locality', ['searchLocalities']),
    handleSearch(e) {
      this.searchLocalities()
    },
  },
}
</script>
