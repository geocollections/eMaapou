<template>
  <v-form @submit.prevent="handleSearch">
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('drillcore')">
      <text-field v-model="name" :label="$t(filters.byIds.name.label)" />
      <text-field
        v-model="repository"
        :label="$t(filters.byIds.repository.label)"
      />
      <text-field v-model="country" :label="$t(filters.byIds.country.label)" />
      <text-field v-model="storage" :label="$t(filters.byIds.storage.label)" />
      <range-text-field
        v-model="boxes"
        :label="$t(filters.byIds.boxes.label)"
      />
    </search-fields-wrapper>

    <search-view-map-wrapper
      borehole-overlay
      :active="geoJSON !== null"
      :items="items"
      class="mt-2"
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

import InstitutionSearchFilter from '@/components/search/InstitutionSearchFilter.vue'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import RangeTextField from '~/components/fields/RangeTextField.vue'
import TextField from '~/components/fields/TextField.vue'
import ExtraOptions from '~/components/search/ExtraOptions.vue'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper.vue'
import { DRILLCORE } from '~/constants'

export default {
  name: 'DrillcoreSearchForm',
  components: {
    ExtraOptions,
    InstitutionSearchFilter,
    TextField,
    RangeTextField,
    SearchFieldsWrapper,
    SearchActions,
    SearchViewMapWrapper,
  },
  computed: {
    ...mapState('search/drillcore', ['filters', 'count', 'items']),
    ...mapFields('search/drillcore', {
      name: 'filters.byIds.name.value',
      repository: 'filters.byIds.repository.value',
      country: 'filters.byIds.country.value',
      boxes: 'filters.byIds.boxes.value',
      storage: 'filters.byIds.storage.value',
    }),
    ...mapFields('search', {
      institution: 'filters.byIds.institutions.value',
      geoJSON: 'filters.byIds.geoJSON.value',
    }),
    ...mapGetters('search', ['hasActiveFilters']),
  },
  methods: {
    isEmpty,
    ...mapActions('search', ['searchResource', 'resetFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleReset(e) {
      this.resetSearch()
      this.resetFilters('drillcore')
      this.searchResource({
        module: 'drillcore',
        resource: 'drillcore',
        isMapEnabled: true,
        isInsitutionsEnabled: true,
        resourceDefaults: DRILLCORE,
      })
    },
    handleSearch(e) {
      this.searchResource({
        module: 'drillcore',
        resource: 'drillcore',
        isMapEnabled: true,
        isInsitutionsEnabled: true,
        resourceDefaults: DRILLCORE,
      })
    },
    async handleMapUpdate(tableState) {
      await this.searchResource({
        options: tableState?.options,
        module: 'drillcore',
        resource: 'drillcore',
        isMapEnabled: true,
        isInsitutionsEnabled: true,
        resourceDefaults: DRILLCORE,
      })
    },
  },
}
</script>
