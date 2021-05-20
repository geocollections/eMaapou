<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="mt-2 d-flex justify-end align-center">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-field v-model="name" :label="$t(filters.byIds.name.label)" />
    <text-field v-model="owner" :label="$t(filters.byIds.owner.label)" />
    <text-field v-model="date" :label="$t(filters.byIds.date.label)" />
    <text-field v-model="remarks" :label="$t(filters.byIds.remarks.label)" />

    <autocomplete-field
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
import TextField from '~/components/fields/TextField.vue'
import AutocompleteField from '~/components/fields/AutocompleteField'
import ExtraOptions from '~/components/search/ExtraOptions'

export default {
  name: 'DatasetSearchForm',
  components: {
    ExtraOptions,
    InstitutionSearchFilter,
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
    AutocompleteField,
  },
  data() {
    return {
      availableParameters: [],
    }
  },
  async fetch() {
    if (this.availableParameters.length === 0) {
      const availableParametersResponse = await this.$services.sarvSolr.getResourceList(
        'analysis_parameter',
        {
          defaultParams: {
            fq: 'is_null:false',
          },
        }
      )
      this.availableParameters = availableParametersResponse?.items.map(
        (parameter) => {
          return { text: parameter.parameter, value: parameter.parameter_index }
        }
      )
    }
  },
  computed: {
    ...mapState('dataset', ['filters']),
    ...mapFields('dataset', {
      name: 'filters.byIds.name.value',
      owner: 'filters.byIds.owner.value',
      date: 'filters.byIds.date.value',
      remarks: 'filters.byIds.remarks.value',
      parameters: 'filters.byIds.parameters.value',
    }),
    ...mapFields('globalSearch', {
      institution: 'filters.byIds.institution.value',
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
    handleParameterInput(e) {
      this.parameters = e
    },
  },
}
</script>
