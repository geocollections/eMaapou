<template>
  <v-form @submit.prevent="handleSearch">
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('dataset')">
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
    </search-fields-wrapper>

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

import SearchActions from '../SearchActions.vue'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import TextField from '~/components/fields/TextField.vue'
import AutocompleteField from '~/components/fields/AutocompleteField'
import ExtraOptions from '~/components/search/ExtraOptions'

export default {
  name: 'DatasetSearchForm',
  components: {
    ExtraOptions,
    InstitutionSearchFilter,
    TextField,
    SearchActions,
    AutocompleteField,
    SearchFieldsWrapper,
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
    ...mapState('search/dataset', ['filters', 'count']),
    ...mapFields('search/dataset', {
      name: 'filters.byIds.name.value',
      owner: 'filters.byIds.owner.value',
      date: 'filters.byIds.date.value',
      remarks: 'filters.byIds.remarks.value',
      parameters: 'filters.byIds.parameters.value',
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
