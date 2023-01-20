<template>
  <div>
    <v-form @submit.prevent="handleSearch">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <search-fields-wrapper>
        <v-card class="mt-3" flat tile color="transparent">
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
              :filter-field="$translate({ et: 'method', en: 'method_en' })"
            >
              <template #selection="{ item }">
                <div>
                  {{ $translate({ et: item.method, en: item.method_en }) }}
                </div>
              </template>
              <template #suggestion="{ item }">
                <div>
                  {{ $translate({ et: item.method, en: item.method_en }) }}
                </div>
              </template>
            </filter-input-autocomplete-static>
            <filter-input-autocomplete-static
              v-model="lab"
              :title="$t('filters.lab').toString()"
              :items="labSuggestions"
              :filter-field="$translate({ et: 'lab', en: 'lab_en' })"
            >
              <template #selection="{ item }">
                <div>
                  {{ $translate({ et: item.lab, en: item.lab_en }) }}
                </div>
              </template>
              <template #suggestion="{ item }">
                <div>
                  {{ $translate({ et: item.lab, en: item.lab_en }) }}
                </div>
              </template>
            </filter-input-autocomplete-static>
            <filter-sample v-model="sample" />
            <filter-locality v-model="locality" />
            <filter-map
              v-model="map"
              :items="$accessor.search.analysis.items"
            />
            <filter-input-text
              v-model="agent"
              :title="$t('filters.agent').toString()"
            />
            <filter-institution v-model="institutions" />
          </v-expansion-panels>
        </v-card>
      </search-fields-wrapper>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
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
export default defineComponent({
  name: 'SearchFormAnalysis',
  components: {
    SearchFieldsWrapper,
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
    const { $accessor, $axios, i18n } = useContext()
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }

    const query = computed({
      get: () => $accessor.search.analysis.query,
      set: (val) => {
        $accessor.search.analysis.setQuery(val)
      },
    })
    const depth = useFilter('analysis', 'depth', handleSearch)
    const method = useFilter('analysis', 'method', handleSearch)
    const lab = useFilter('analysis', 'lab', handleSearch)
    const agent = useFilter('analysis', 'agent', handleSearch)

    const locality = useFilter('analysis', 'locality', handleSearch)
    const sample = useFilter('analysis', 'sample', handleSearch)
    const map = useFilter('analysis', 'map', handleSearch)

    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleSearch()
      },
    })
    const state = reactive({
      methodSuggestions: [] as any[],
      labSuggestions: [] as any[],
    })
    const hydrateFilterLocality = useHydrateFilterLocality()
    const hydrateFilterSample = useHydrateFilterSample()
    const hydrateFilterStatic = useHydrateFilterStatic()
    useFetch(async () => {
      const methodSortField =
        i18n.locale === 'et' ? 'analysis_method' : 'analysis_method_en'
      state.methodSuggestions = (
        await $axios.$get(
          `https://api.geoloogia.info/solr/analysis?q=%2A&start=0&rows=0&facet=true&facet.pivot=method,analysis_method,analysis_method_en&facet.limit=200&facet.sort=${methodSortField}`
        )
      ).facet_counts.facet_pivot[
        'method,analysis_method,analysis_method_en'
      ].map((method: any) => {
        return {
          id: method.value,
          method: method.pivot[0].value,
          method_en: method.pivot[0].pivot[0].value,
        }
      })
      const labSortField = i18n.locale === 'et' ? 'lab' : 'lab_en'
      state.labSuggestions = (
        await $axios.$get(
          `https://api.geoloogia.info/solr/analysis?q=%2A&start=0&rows=0&facet=true&facet.pivot=lab_id,lab,lab_en&facet.limit=200&facet.sort=${labSortField}`
        )
      ).facet_counts.facet_pivot['lab_id,lab,lab_en'].map((lab: any) => {
        return {
          id: lab.value,
          lab: lab.pivot[0].value,
          lab_en: lab.pivot[0].pivot[0].value,
        }
      })
      hydrateFilterStatic(method, 'method', state.methodSuggestions, Number)
      hydrateFilterStatic(lab, 'lab', state.labSuggestions, Number)

      await hydrateFilterSample(sample, 'sample')
      await hydrateFilterLocality(locality, 'locality')
    })
    return {
      ...toRefs(state),
      handleReset,
      handleSearch,
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
