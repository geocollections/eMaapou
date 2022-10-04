<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('stratigraphy')">
      <input-text v-model="number" :label="$t(filters.byIds.id.label)" />

      <input-autocomplete
        v-model="hierarchy"
        :items="autocomplete.stratigraphy"
        :loading="autocomplete.loaders.stratigraphy"
        :label="$t(filters.byIds.stratigraphy.label)"
        :item-text="stratigraphyLabel"
        @search:items="autocompleteStratigraphySearch"
      />

      <input-text v-model="index" :label="$t(filters.byIds.index.label)" />

      <input-text v-model="age" :label="$t(filters.byIds.age.label)" />
    </search-fields-wrapper>
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import autocompleteMixin from '~/mixins/autocompleteMixin'

export default {
  name: 'SearchFormStratigraphy',
  mixins: [autocompleteMixin],
  data() {
    return {
      autocomplete: {
        stratigraphy: [],
        loaders: {
          stratigraphy: false,
        },
      },
    }
  },
  computed: {
    ...mapState('search/stratigraphy', ['filters', 'count']),
    ...mapFields('search/stratigraphy', {
      number: 'filters.byIds.id.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      index: 'filters.byIds.index.value',
      age: 'filters.byIds.age.value',
      query: 'query',
    }),
    ...mapGetters('search', ['hasActiveFilters']),
  },
  created() {
    this.fillAutocompleteLists()
  },
  methods: {
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/stratigraphy', ['searchStratigraphies']),
    handleSearch(e) {
      this.searchStratigraphies()
    },
    async handleReset(e) {
      await this.resetFilters('stratigraphy')
      this.searchStratigraphies()
    },
    fillAutocompleteLists() {
      if (this.hierarchy) this.autocomplete.stratigraphy.push(this.hierarchy)
    },
  },
}
</script>
