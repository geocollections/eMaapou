<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="mt-2 d-flex justify-end align-center">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-field v-model="number" :label="$t(filters.byIds.number.label)" />

    <text-field v-model="locality" :label="$t(filters.byIds.locality.label)" />

    <!--    <text-field-->
    <!--      v-model="stratigraphy"-->
    <!--      :label="$t(filters.byIds.stratigraphy.label)"-->
    <!--    />-->

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

    <institution-search-filter
      class="pt-1"
      :institution="institution"
      @change:institution="institution = $event"
    />

    <extra-options class="pt-1" />
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import InstitutionSearchFilter from '@/components/search/InstitutionSearchFilter'
import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'
import RangeSliderField from '~/components/fields/RangeSliderField'
import TextField from '~/components/fields/TextField'
import AutocompleteField from '~/components/fields/AutocompleteField'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import ExtraOptions from '~/components/search/ExtraOptions'

export default {
  name: 'SampleSearchForm',
  components: {
    ExtraOptions,
    InstitutionSearchFilter,
    AutocompleteField,
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
    RangeSliderField,
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
    ...mapState('sample', ['filters']),
    ...mapFields('sample', {
      number: 'filters.byIds.number.value',
      locality: 'filters.byIds.locality.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      depth: 'filters.byIds.depth.value',
      collector: 'filters.byIds.collector.value',
      mass: 'filters.byIds.mass.value',
      project: 'filters.byIds.project.value',
    }),
    ...mapFields('globalSearch', {
      institution: 'filters.byIds.institution.value',
    }),
  },
  created() {
    this.fillAutocompleteLists()
  },
  methods: {
    ...mapActions('sample', ['searchSamples', 'resetSampleFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchSamples()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetSampleFilters()
      this.searchSamples()
    },
    fillAutocompleteLists() {
      if (this.hierarchy) this.autocomplete.stratigraphy.push(this.hierarchy)
    },
  },
}
</script>
