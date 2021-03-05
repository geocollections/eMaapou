<template>
  <v-form>
    <global-search />
    <v-btn @click="handleSearch"> Search </v-btn>
    <text-search-field v-model="name" :label="$t(search.byIds.name.label)" />
    <text-search-field
      v-model="repository"
      :label="$t(search.byIds.repository.label)"
    />
    <text-search-field
      v-model="country"
      :label="$t(search.byIds.country.label)"
    />
    <text-search-field
      v-model="storage"
      :label="$t(search.byIds.storage.label)"
    />
    <!-- TODO: Get min and max dynamically -->
    <range-search-field
      v-model="boxes"
      :min="0"
      :max="100"
      :label="$t(search.byIds.boxes.label)"
    />
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import GlobalSearch from './GlobalSearch.vue'
import TextSearchField from './TextSearchField.vue'
import RangeSearchField from './RangeSearchField.vue'

export default {
  name: 'DrillcoreDrawer',
  components: { TextSearchField, RangeSearchField, GlobalSearch },
  computed: {
    ...mapState(['isDrawerOpen']),
    ...mapState('drillcore', ['search']),
    ...mapFields('drillcore', {
      name: 'search.byIds.name.value',
      repository: 'search.byIds.repository.value',
      country: 'search.byIds.country.value',
      boxes: 'search.byIds.boxes.value',
      storage: 'search.byIds.storage.value',
    }),
  },
  methods: {
    ...mapActions('drillcore', ['searchDrillcores']),
    handleSearch(e) {
      this.searchDrillcores()
    },
  },
}
</script>
