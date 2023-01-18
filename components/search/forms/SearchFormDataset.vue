<template>
  <div>
    <v-form @submit.prevent="handleSearch">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <search-fields-wrapper>
        <v-card class="mt-3" flat tile color="transparent">
          <v-expansion-panels accordion flat tile multiple>
            <filter-input-text
              v-model="name"
              :title="$t('filters.datasetName').toString()"
            />
            <filter-analysis-parameter v-model="analysisParameter" />
            <filter-input-text
              v-model="owner"
              :title="$t('filters.owner').toString()"
            />

            <filter-input-text
              v-model="date"
              :title="$t('filters.date').toString()"
            />
            <filter-institution v-model="institution" />
          </v-expansion-panels>
        </v-card>
        <!-- <input-text v-model="name" :label="$t(filters.byIds.name.label)" />
      <input-text v-model="owner" :label="$t(filters.byIds.owner.label)" />
      <input-text v-model="date" :label="$t(filters.byIds.date.label)" />
      <input-text v-model="remarks" :label="$t(filters.byIds.remarks.label)" />
      <input-autocomplete-parameter
        v-model="parameters"
        multi-select
        :label="$t('dataset.parameters')"
      /> -->
      </search-fields-wrapper>

      <!-- <search-institution-filter
      class="mt-2"
      :active="!isEmpty(institution)"
      :institution="institution"
      @change:institution="handleInstitutionsUpdate"
    /> -->
    </v-form>
  </div>
</template>

<script lang="ts">
import isEmpty from 'lodash/isEmpty'

import {
  computed,
  defineComponent,
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import SearchActions from '../SearchActions.vue'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
// import SearchInstitutionFilter from '~/components/search/SearchInstitutionFilter.vue'
// import InputText from '~/components/input/InputText.vue'
import InputSearch from '~/components/input/InputSearch.vue'
// import InputAutocompleteParameter from '~/components/input/InputAutocompleteParameter.vue'
import FilterAnalysisParameter from '~/components/filter/FilterAnalysisParameter.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import { useHydrateFilterAnalysisParameter } from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
export default defineComponent({
  name: 'SearchFormDataset',
  components: {
    // SearchInstitutionFilter,
    // InputText,
    SearchActions,
    SearchFieldsWrapper,
    InputSearch,
    FilterAnalysisParameter,
    FilterInstitution,
    FilterInputText,
    // InputAutocompleteParameter,
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const route = useRoute()
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const hydrateFilterAnalysisParameter = useHydrateFilterAnalysisParameter()
    useFetch(async () => {
      if (route.value.query.analysisParameter) {
        analysisParameter.value = (
          await hydrateFilterAnalysisParameter(
            (route.value.query.analysisParameter as string)
              .split(',')
              .map((encodedValue) => decodeURIComponent(encodedValue))
          )
        ).data.response.docs
      }
    })

    const query = computed({
      get: () => $accessor.search.dataset.query,
      set: (val) => {
        $accessor.search.dataset.setQuery(val)
      },
    })
    const name = useFilter('dataset', 'name', handleSearch)
    const date = useFilter('dataset', 'date', handleSearch)
    const owner = useFilter('dataset', 'owner', handleSearch)
    const analysisParameter = useFilter(
      'dataset',
      'analysisParameter',
      handleSearch
    )
    const institution = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleSearch()
      },
    })
    return {
      query,
      analysisParameter,
      institution,
      date,
      owner,
      name,
      isEmpty,
      handleReset,
      handleSearch,
    }
  },
  // data() {
  //   return {
  //     availableParameters: [],
  //   }
  // },
  // async fetch() {
  //   if (this.availableParameters.length === 0) {
  //     const availableParametersResponse =
  //       await this.$services.sarvSolr.getResourceList('analysis_parameter', {
  //         defaultParams: {
  //           fq: 'is_null:false',
  //         },
  //       })
  //     this.availableParameters = availableParametersResponse?.items.map(
  //       (parameter: any) => {
  //         return { text: parameter.parameter, value: parameter.parameter_index }
  //       }
  //     )
  //   }
  // },
  // methods: {
  //   handleParameterInput(e: any) {
  //     this.parameters = e
  //   },
  //   handleInstitutionsUpdate(newInstitutions: any[]) {
  //     this.institution = newInstitutions
  //     this.$emit('update')
  //   },
  // },
})
</script>
