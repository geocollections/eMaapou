<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
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
    </v-form>
  </div>
</template>

<script lang="ts">
import isEmpty from 'lodash/isEmpty'

import {
  computed,
  defineComponent,
  ref,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterAnalysisParameter from '~/components/filter/FilterAnalysisParameter.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import { useHydrateFilterAnalysisParameter } from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
import { useWatchSearchQueryParams } from '~/composables/useWatchSearchQueryParams'
export default defineComponent({
  name: 'SearchFormDataset',
  components: {
    SearchActions,
    InputSearch,
    FilterAnalysisParameter,
    FilterInstitution,
    FilterInputText,
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const emitUpdate = ref(true)
    const handleReset = () => {
      emit('reset')
    }
    const handleUpdate = () => {
      if (!emitUpdate.value) return
      emit('update')
    }
    const query = computed({
      get: () => $accessor.search.dataset.query,
      set: (val) => {
        $accessor.search.dataset.setQuery(val)
      },
    })
    const name = useFilter('dataset', 'name', handleUpdate)
    const date = useFilter('dataset', 'date', handleUpdate)
    const owner = useFilter('dataset', 'owner', handleUpdate)
    const analysisParameter = useFilter(
      'dataset',
      'analysisParameter',
      handleUpdate
    )
    const institution = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleUpdate()
      },
    })
    const hydrateFilterAnalysisParameter = useHydrateFilterAnalysisParameter()

    useWatchSearchQueryParams(() => fetch())

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false
      await hydrateFilterAnalysisParameter(
        analysisParameter,
        'analysisParameter'
      )
      emitUpdate.value = true
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
      handleUpdate,
    }
  },
})
</script>
