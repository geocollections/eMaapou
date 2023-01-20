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
      </search-fields-wrapper>
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
} from '@nuxtjs/composition-api'
import SearchActions from '../SearchActions.vue'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterAnalysisParameter from '~/components/filter/FilterAnalysisParameter.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import { useHydrateFilterAnalysisParameter } from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
export default defineComponent({
  name: 'SearchFormDataset',
  components: {
    SearchActions,
    SearchFieldsWrapper,
    InputSearch,
    FilterAnalysisParameter,
    FilterInstitution,
    FilterInputText,
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
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
    const hydrateFilterAnalysisParameter = useHydrateFilterAnalysisParameter()
    useFetch(async () => {
      await hydrateFilterAnalysisParameter(
        analysisParameter,
        'analysisParameter'
      )
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
})
</script>
