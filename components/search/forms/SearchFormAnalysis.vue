<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels accordion flat tile multiple>
        <filter-input-range
          v-model="depth"
          :label="$t('filters.depth').toString()"
          interval-labels="intervals.depth"
          :step="0.01"
        />
        <filter-input-autocomplete-static
          v-model="method"
          :title="$t('filters.method').toString()"
          :items="methodSuggestions"
          :filter-field="$translate({ et: 'text', en: 'text_en' })"
        />
        <filter-input-autocomplete-static
          v-model="lab"
          :title="$t('filters.lab').toString()"
          :items="labSuggestions"
          :filter-field="$translate({ et: 'text', en: 'text_en' })"
        />
        <filter-sample v-model="sample" />
        <filter-locality v-model="locality" />
        <filter-map v-model="map" :items="$accessor.search.analysis.items" />
        <filter-input-text
          v-model="agent"
          :title="$t('filters.agent').toString()"
        />
        <filter-institution v-model="institutions" />
      </v-expansion-panels>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import FilterLocality from '~/components/filter/FilterLocality.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import {
  useHydrateFilterLocality,
  useHydrateFilterSample,
  useHydrateFilterStatic,
} from '~/composables/useHydrateFilter'
import FilterSample from '~/components/filter/FilterSample.vue'
import { useFilter } from '~/composables/useFilter'
import { useGetSuggestions } from '~/composables/useGetSuggestions'
export default defineComponent({
  name: 'SearchFormAnalysis',
  components: {
    SearchActions,
    InputSearch,
    FilterInputRange,
    FilterInputAutocompleteStatic,
    FilterLocality,
    FilterMap,
    FilterInstitution,
    FilterInputText,
    FilterSample,
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
      get: () => $accessor.search.analysis.query,
      set: (val) => {
        $accessor.search.analysis.setQuery(val)
      },
    })
    const depth = useFilter('analysis', 'depth', handleUpdate)
    const method = useFilter('analysis', 'method', handleUpdate)
    const lab = useFilter('analysis', 'lab', handleUpdate)
    const agent = useFilter('analysis', 'agent', handleUpdate)

    const locality = useFilter('analysis', 'locality', handleUpdate)
    const sample = useFilter('analysis', 'sample', handleUpdate)
    const map = useFilter('analysis', 'map', handleUpdate)

    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleUpdate()
      },
    })
    const state = reactive({
      methodSuggestions: [] as any[],
      labSuggestions: [] as any[],
    })
    const hydrateFilterLocality = useHydrateFilterLocality()
    const hydrateFilterSample = useHydrateFilterSample()
    const hydrateFilterStatic = useHydrateFilterStatic()
    const getSuggestions = useGetSuggestions()
    useFetch(async () => {
      emitUpdate.value = false
      const suggestionPromise = Promise.all([
        getSuggestions(
          'analysis',
          'method,analysis_method,analysis_method_en',
          { et: 'analysis_method', en: 'analysis_method_en' }
        ),
        getSuggestions('analysis', 'lab_id,lab,lab_en', {
          et: 'lab',
          en: 'lab_en',
        }),
      ])
      const hydrationPromise = Promise.all([
        hydrateFilterSample(sample, 'sample'),
        hydrateFilterLocality(locality, 'locality'),
      ])
      const [suggestionResults] = await Promise.all([
        suggestionPromise,
        hydrationPromise,
      ])

      state.methodSuggestions = suggestionResults[0]
      state.labSuggestions = suggestionResults[1]

      hydrateFilterStatic(method, 'method', state.methodSuggestions, Number)
      hydrateFilterStatic(lab, 'lab', state.labSuggestions, Number)
      emitUpdate.value = true
    })
    return {
      ...toRefs(state),
      handleReset,
      handleUpdate,
      depth,
      query,
      method,
      locality,
      map,
      institutions,
      lab,
      agent,
      sample,
    }
  },
})
</script>
