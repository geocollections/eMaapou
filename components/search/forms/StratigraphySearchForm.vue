<template>
  <v-form @submit.prevent="handleSearch">
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('stratigraphy')">
      <text-field v-model="number" :label="$t(filters.byIds.id.label)" />

      <autocomplete-field
        v-model="hierarchy"
        :items="autocomplete.stratigraphy"
        :loading="autocomplete.loaders.stratigraphy"
        :label="$t(filters.byIds.stratigraphy.label)"
        :item-text="stratigraphyLabel"
        @search:items="autocompleteStratigraphySearch"
      />

      <text-field v-model="index" :label="$t(filters.byIds.index.label)" />

      <text-field v-model="age" :label="$t(filters.byIds.age.label)" />
    </search-fields-wrapper>

    <extra-options class="mt-2" />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import TextField from '~/components/fields/TextField.vue'
import AutocompleteField from '~/components/fields/AutocompleteField.vue'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import ExtraOptions from '~/components/search/ExtraOptions.vue'

export default {
  name: 'StratigraphySearchForm',
  components: {
    ExtraOptions,
    TextField,
    AutocompleteField,
    SearchFieldsWrapper,
    SearchActions,
  },
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
