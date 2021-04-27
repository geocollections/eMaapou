<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-field v-model="id" :label="$t(filters.byIds.id.label)" />
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'
import TextField from '~/components/fields/TextField.vue'

export default {
  name: 'AnalyticalDataSearchForm',
  components: {
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
  },
  computed: {
    ...mapState('analyticalData', ['filters']),
    ...mapFields('analyticalData', {
      id: 'filters.byIds.id.value',
    }),
  },
  methods: {
    ...mapActions('analyticalData', [
      'searchAnalyticalData',
      'resetAnalyticalDataFilters',
    ]),
    ...mapActions('landing', ['resetSearch']),
    handleReset(e) {
      this.resetSearch()
      this.resetAnalyticalDataFilters()
      this.searchAnalyticalData()
    },
    handleSearch(e) {
      this.searchAnalyticalData()
    },
  },
}
</script>
