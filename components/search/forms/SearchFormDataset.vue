<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('dataset')">
      <input-text v-model="name" :label="$t(filters.byIds.name.label)" />
      <input-text v-model="owner" :label="$t(filters.byIds.owner.label)" />
      <input-text v-model="date" :label="$t(filters.byIds.date.label)" />
      <input-text v-model="remarks" :label="$t(filters.byIds.remarks.label)" />

      <input-autocomplete
        :label="$t('dataset.parameters')"
        chips
        clearable
        multiple
        :items="availableParameters"
        :value="parameters"
        return-object
        item-text="text"
        small-chips
        deletable-chips
        @input="handleParameterInput"
      />
    </search-fields-wrapper>

    <search-institution-filter
      class="mt-2"
      :active="!isEmpty(institution)"
      :institution="institution"
      @change:institution="institution = $event"
    />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import isEmpty from 'lodash/isEmpty'

import SearchActions from '../SearchActions.vue'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchInstitutionFilter from '~/components/search/SearchInstitutionFilter.vue'
import InputText from '~/components/input/InputText.vue'
import InputAutocomplete from '~/components/input/InputAutocomplete.vue'
import InputSearch from '~/components/input/InputSearch.vue'

export default {
  name: 'SearchFormDataset',
  components: {
    SearchInstitutionFilter,
    InputText,
    SearchActions,
    InputAutocomplete,
    SearchFieldsWrapper,
    InputSearch,
  },
  data() {
    return {
      availableParameters: [],
    }
  },
  async fetch() {
    if (this.availableParameters.length === 0) {
      const availableParametersResponse =
        await this.$services.sarvSolr.getResourceList('analysis_parameter', {
          defaultParams: {
            fq: 'is_null:false',
          },
        })
      this.availableParameters = availableParametersResponse?.items.map(
        (parameter) => {
          return { text: parameter.parameter, value: parameter.parameter_index }
        }
      )
    }
  },
  computed: {
    ...mapState('search/dataset', ['filters', 'count']),
    ...mapFields('search/dataset', {
      name: 'filters.byIds.name.value',
      owner: 'filters.byIds.owner.value',
      date: 'filters.byIds.date.value',
      remarks: 'filters.byIds.remarks.value',
      parameters: 'filters.byIds.parameters.value',
      query: 'query',
    }),
    ...mapFields('search', {
      institution: 'globalFilters.byIds.institutions.value',
    }),
    ...mapGetters('search', ['hasActiveFilters']),
  },
  methods: {
    isEmpty,
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/dataset', ['searchDatasets']),
    async handleReset(e) {
      await this.resetFilters('dataset')
      this.searchDatasets()
    },
    handleSearch(e) {
      this.searchDatasets()
    },
    handleParameterInput(e) {
      this.parameters = e
    },
  },
}
</script>
