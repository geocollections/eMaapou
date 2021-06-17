<template>
  <v-form @submit.prevent="handleSearch">
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('sample')">
      <text-field v-model="number" :label="$t(filters.byIds.number.label)" />

      <text-field
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />

      <autocomplete-field
        v-model="hierarchy"
        :items="autocomplete.stratigraphy"
        :loading="autocomplete.loaders.stratigraphy"
        :label="$t(filters.byIds.hierarchy.label)"
        :item-text="stratigraphyLabel"
        @search:items="autocompleteStratigraphySearch"
      />

      <text-field
        v-model="collector"
        :label="$t(filters.byIds.collector.label)"
      />

      <range-slider-field
        v-model="depth"
        :min="-20"
        :max="5000"
        :label="$t(filters.byIds.depth.label)"
      />

      <text-field v-model="mass" :label="$t(filters.byIds.mass.label)" />
      <text-field v-model="project" :label="$t(filters.byIds.project.label)" />
      <!--    <range-search-field-->
      <!--      v-model="mass"-->
      <!--      :min="0"-->
      <!--      :max="1000000"-->
      <!--      :label="$t(filters.byIds.mass.label)"-->
      <!--    />-->
    </search-fields-wrapper>
    <search-view-map-wrapper
      sample-overlay
      :items="items"
      class="mt-2"
      :active="geoJSON != null"
      @update="handleMapUpdate"
    />
    <institution-search-filter
      class="mt-2"
      :active="!isEmpty(institution)"
      :institution="institution"
      @change:institution="institution = $event"
    />

    <extra-options class="mt-2" />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { isEmpty } from 'lodash'

import InstitutionSearchFilter from '@/components/search/InstitutionSearchFilter'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import RangeSliderField from '~/components/fields/RangeSliderField'
import TextField from '~/components/fields/TextField'
import AutocompleteField from '~/components/fields/AutocompleteField'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import ExtraOptions from '~/components/search/ExtraOptions'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'

export default {
  name: 'SampleSearchForm',
  components: {
    ExtraOptions,
    InstitutionSearchFilter,
    AutocompleteField,
    TextField,
    RangeSliderField,
    SearchFieldsWrapper,
    SearchActions,
    SearchViewMapWrapper,
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
    ...mapState('search/sample', ['filters', 'count', 'items']),
    ...mapFields('search/sample', {
      number: 'filters.byIds.number.value',
      locality: 'filters.byIds.locality.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      depth: 'filters.byIds.depth.value',
      collector: 'filters.byIds.collector.value',
      mass: 'filters.byIds.mass.value',
      project: 'filters.byIds.project.value',
    }),
    ...mapFields('search', {
      institution: 'globalFilters.byIds.institutions.value',
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('search', ['hasActiveFilters']),
  },
  created() {
    this.fillAutocompleteLists()
  },
  methods: {
    isEmpty,
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/sample', ['searchSamples']),
    handleSearch(e) {
      this.searchSamples()
    },
    async handleReset(e) {
      await this.resetFilters('sample')
      this.searchSamples()
    },
    fillAutocompleteLists() {
      if (this.hierarchy) this.autocomplete.stratigraphy.push(this.hierarchy)
    },
    handleMapUpdate(tableState) {
      this.searchSamples(tableState?.options)
    },
  },
}
</script>
