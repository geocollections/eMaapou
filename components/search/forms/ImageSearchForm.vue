<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="mt-2 d-flex justify-end align-center">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-field v-model="locality" :label="$t(filters.byIds.locality.label)" />

    <text-field v-model="people" :label="$t(filters.byIds.people.label)" />
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
  name: 'ImageSearchForm',
  components: {
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
  },
  computed: {
    ...mapState('image', ['filters']),
    ...mapFields('image', {
      locality: 'filters.byIds.locality.value',
      people: 'filters.byIds.people.value',
    }),
  },
  methods: {
    ...mapActions('image', ['searchImages', 'resetImageFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchImages()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetImageFilters()
      this.searchImages()
    },
  },
}
</script>
