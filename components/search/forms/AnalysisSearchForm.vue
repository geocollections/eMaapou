<template>
  <v-form @submit.prevent="handleSearch">
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters">
      <text-field v-model="id" :label="$t(filters.byIds.id.label)" />
      <!-- TODO: Get min and max dynamically -->
      <range-slider-field
        v-model="depth"
        :min="-20"
        :max="5000"
        :label="$t(filters.byIds.depth.label)"
      />
    </search-fields-wrapper>

    <search-view-map-wrapper
      :items="items"
      class="mt-2"
      :active="geoJSON"
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
import RangeSliderField from '~/components/fields/RangeSliderField.vue'
import TextField from '~/components/fields/TextField.vue'
import ExtraOptions from '~/components/search/ExtraOptions'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
export default {
  name: 'AnalysisSearchForm',
  components: {
    ExtraOptions,
    InstitutionSearchFilter,
    TextField,
    RangeSliderField,
    SearchFieldsWrapper,
    SearchActions,
    SearchViewMapWrapper,
  },
  computed: {
    ...mapState('analysis', ['filters', 'count', 'items']),
    ...mapFields('analysis', {
      id: 'filters.byIds.id.value',
      depth: 'filters.byIds.depth.value',
    }),
    ...mapFields('globalSearch', {
      institution: 'filters.byIds.institution.value',
      geoJSON: 'filters.byIds.geoJSON.value',
    }),
    ...mapGetters('analysis', ['hasActiveFilters']),
  },
  methods: {
    isEmpty,
    ...mapActions('analysis', ['searchAnalyses', 'resetAnalysisFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleReset(e) {
      this.resetSearch()
      this.resetAnalysisFilters()
      this.searchAnalyses()
    },
    handleSearch(e) {
      this.searchAnalyses()
    },
    async handleMapUpdate(tableState) {
      await this.searchAnalyses(tableState?.options)
    },
  },
}
</script>
