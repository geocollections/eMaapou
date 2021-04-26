<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-field v-model="name" :label="$t(filters.byIds.name.label)" />
    <text-field v-model="owner" :label="$t(filters.byIds.owner.label)" />
    <text-field v-model="date" :label="$t(filters.byIds.date.label)" />
    <text-field v-model="remarks" :label="$t(filters.byIds.remarks.label)" />
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
  name: 'DatasetSearchForm',
  components: {
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
  },
  computed: {
    ...mapState('dataset', ['filters']),
    ...mapFields('dataset', {
      name: 'filters.byIds.name.value',
      owner: 'filters.byIds.owner.value',
      date: 'filters.byIds.date.value',
      remarks: 'filters.byIds.remarks.value',
    }),
  },
  methods: {
    ...mapActions('dataset', ['searchDatasets', 'resetDatasetFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleReset(e) {
      this.resetSearch()
      this.resetDatasetFilters()
      this.searchDatasets()
    },
    handleSearch(e) {
      this.searchDatasets()
    },
  },
}
</script>
