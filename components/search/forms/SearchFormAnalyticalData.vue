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
              :filter-field="$translate({ et: 'text', en: 'text_en' })"
            />
            <filter-input-autocomplete-static
              v-model="lab"
              :title="$t('filters.lab').toString()"
              :items="labSuggestions"
              :filter-field="$translate({ et: 'text', en: 'text_en' })"
            />
            <filter-input-autocomplete-static
              v-model="project"
              :title="$t('filters.project').toString()"
              :items="projectSuggestions"
              :filter-field="$translate({ et: 'text', en: 'text_en' })"
            />
            <filter-dataset v-model="dataset" />
            <filter-sample v-model="sample" />
            <filter-input-parameter
              v-model="parameter"
              :parameters="parameterSuggestions"
            />
            <filter-stratigraphy v-model="stratigraphyHierarchy" chrono />
            <filter-stratigraphy
              v-model="lithostratigraphyHierarchy"
              litho
              :label="$t('filters.lithostratigraphyHierarchy').toString()"
            />
            <filter-reference v-model="reference" />
            <filter-locality v-model="locality" />
            <filter-site v-model="site" />
            <filter-map
              v-model="map"
              locality-overlay
              site-overlay
              :items="$accessor.search.analyticalData.items"
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
  useRoute,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputParameter from '~/components/filter/input/FilterInputParameter.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterStratigraphy from '~/components/filter/FilterStratigraphy.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import FilterSample from '~/components/filter/FilterSample.vue'
import FilterLocality from '~/components/filter/FilterLocality.vue'
import FilterSite from '~/components/filter/FilterSite.vue'
import FilterDataset from '~/components/filter/FilterDataset.vue'
import FilterReference from '~/components/filter/FilterReference.vue'
import { useFilter } from '~/composables/useFilter'
import {
  useHydrateFilterDataset,
  useHydrateFilterLocality,
  useHydrateFilterReferenceId,
  useHydrateFilterSample,
  useHydrateFilterSite,
  useHydrateFilterStatic,
  useHydrateFilterStratigraphy,
} from '~/composables/useHydrateFilter'
import { useGetSuggestions } from '~/composables/useGetSuggestions'
export default defineComponent({
  name: 'SearchFormAnalyticalData',
  fetchOnServer: false,
  components: {
    SearchFieldsWrapper,
    SearchActions,
    InputSearch,
    FilterInputParameter,
    FilterInputRange,
    FilterStratigraphy,
    FilterMap,
    FilterInstitution,
    FilterInputAutocompleteStatic,
    FilterSample,
    FilterReference,
    FilterLocality,
    FilterSite,
    FilterDataset,
  },
  setup(_props, { emit }) {
    const { $accessor, $services } = useContext()
    const route = useRoute()
    const handleSearch = () => {
      emit('update')
    }
    const handleReset = () => {
      emit('reset')
    }
    const query = computed({
      get: () => $accessor.search.analyticalData.query,
      set: (val) => {
        $accessor.search.analyticalData.setQuery(val)
      },
    })
    const parameter = useFilter('analyticalData', 'parameter', () => {
      handleSearch()
      $accessor.headers.setAnalyticalDataParameterHeader({
        options: $accessor.search.analyticalData.options,
      })
    })
    const depth = useFilter('analyticalData', 'depth', handleSearch)
    const stratigraphyHierarchy = useFilter(
      'analyticalData',
      'stratigraphyHierarchy',
      handleSearch
    )
    const lithostratigraphyHierarchy = useFilter(
      'analyticalData',
      'lithostratigraphyHierarchy',
      handleSearch
    )
    const map = useFilter('analyticalData', 'map', handleSearch)
    const method = useFilter('analyticalData', 'method', handleSearch)
    const sample = useFilter('analyticalData', 'sample', handleSearch)
    const locality = useFilter('analyticalData', 'locality', handleSearch)
    const site = useFilter('analyticalData', 'site', handleSearch)
    const lab = useFilter('analyticalData', 'lab', handleSearch)
    const project = useFilter('analyticalData', 'project', handleSearch)
    const dataset = useFilter('analyticalData', 'dataset', handleSearch)
    const reference = useFilter('analyticalData', 'reference', handleSearch)
    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleSearch()
      },
    })
    const state = reactive({
      parameterSuggestions: [] as any[],
      methodSuggestions: [] as any[],
      labSuggestions: [] as any[],
      projectSuggestions: [] as any[],
    })
    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()
    const hydrateFilterSample = useHydrateFilterSample()
    const hydrateFilterLocality = useHydrateFilterLocality()
    const hydrateFilterSite = useHydrateFilterSite()
    const hydrateFilterDataset = useHydrateFilterDataset()
    const hydrateFilterReference = useHydrateFilterReferenceId()
    const hydrateFilterStatic = useHydrateFilterStatic()
    const getSuggestions = useGetSuggestions()
    useFetch(async () => {
      const suggestionPromise = Promise.all([
        getSuggestions(
          'analytical_data',
          'method_id,analysis_method,analysis_method_en',
          { et: 'analysis_method', en: 'analysis_method_en' }
        ),
        getSuggestions('analytical_data', 'lab_id,lab,lab_en', {
          et: 'lab',
          en: 'lab_en',
        }),
        getSuggestions(
          'analytical_data',
          'project_id,project_name,project_name_en',
          { et: 'project_name', en: 'project_name' }
        ),
      ])
      const listParametersPromise = $services.sarvSolr.getResourceList(
        'analysis_parameter',
        {
          defaultParams: {
            fq: 'is_null:false',
          },
          options: {
            page: 1,
            itemsPerPage: 1000,
          },
        }
      )
      const hydrationPromise = Promise.all([
        hydrateFilterStratigraphy(
          stratigraphyHierarchy,
          'stratigraphyHierarchy'
        ),
        hydrateFilterStratigraphy(
          stratigraphyHierarchy,
          'lithostratigraphyHierarchy'
        ),
        hydrateFilterSample(sample, 'sample'),
        hydrateFilterDataset(dataset, 'dataset'),
        hydrateFilterReference(reference, 'reference'),
        hydrateFilterLocality(locality, 'locality'),
        hydrateFilterSite(site, 'site'),
      ])
      const [suggestionResults, listParametersResponse] = await Promise.all([
        suggestionPromise,
        listParametersPromise,
        hydrationPromise,
      ])

      state.methodSuggestions = suggestionResults[0]
      state.labSuggestions = suggestionResults[1]
      state.projectSuggestions = suggestionResults[2]

      const parameters = listParametersResponse.items
        .filter((parameter: any) => !!parameter.parameter_index)
        .reduce((prev: any, parameter: any) => {
          const correctParameterIndex = parameter.parameter_index.replace(
            /\W/g,
            '_'
          )
          return {
            ...prev,
            [correctParameterIndex]: {
              value: correctParameterIndex,
              text: parameter.parameter,
            },
          }
        }, {})
      $accessor.search.analyticalData.setParameters({ parameters })

      if (route.value.query.parameter) {
        for (const parameterFilter of $accessor.search.analyticalData.filters
          .parameter.value) {
          $accessor.headers.showHeader({
            module: 'analytical_data',
            headerId: parameterFilter.parameter,
          })
        }
      }
      hydrateFilterStatic(method, 'method', state.methodSuggestions, Number)
      hydrateFilterStatic(lab, 'lab', state.labSuggestions, Number)
      hydrateFilterStatic(project, 'project', state.projectSuggestions, Number)

      state.parameterSuggestions = Object.values(parameters)
    })
    return {
      ...toRefs(state),
      query,
      parameter,
      depth,
      stratigraphyHierarchy,
      lithostratigraphyHierarchy,
      map,
      institutions,
      method,
      sample,
      locality,
      site,
      lab,
      project,
      dataset,
      reference,
      handleSearch,
      handleReset,
    }
  },
})
</script>
