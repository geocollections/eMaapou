<template>
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
          <filter-map
            v-model="map"
            locality-overlay
            site-overlay
            :items="$accessor.search.analyticalData.items"
          />
          <filter-institution v-model="institutions" />
        </v-expansion-panels>
      </v-card>
      <!-- <v-row no-gutters>
        <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
          <input-text
            v-model="locality"
            :label="$t(filters.byIds.locality.label)"
          />
        </v-col>
        <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
          <input-range v-model="depth" :label="$t(filters.byIds.depth.label)" />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
          <input-autocomplete-stratigraphy
            v-model="stratigraphy"
            chrono
            return-object
            :label="$t(filters.byIds.stratigraphy.label)"
          />
        </v-col>
        <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
          <input-autocomplete-stratigraphy
            v-model="lithostratigraphy"
            litho
            return-object
            :label="$t(filters.byIds.lithostratigraphy.label)"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
          <input-text
            v-model="analysis"
            :label="$t(filters.byIds.analysis.label)"
          />
        </v-col>
        <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
          <input-text
            v-model="method"
            :label="$t(filters.byIds.method.label)"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
          <input-text v-model="lab" :label="$t(filters.byIds.lab.label)" />
        </v-col>
        <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
          <input-text
            v-model="agentAnalysed"
            :label="$t(filters.byIds.agentAnalysed.label)"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
          <input-text
            v-model="reference"
            :label="$t(filters.byIds.reference.label)"
          />
        </v-col>
        <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
          <input-text
            v-model="dataset"
            :label="$t(filters.byIds.dataset.label)"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
          <input-text
            v-model="stratigraphyBed"
            :label="$t(filters.byIds.stratigraphyBed.label)"
          />
        </v-col>
        <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
          <input-text v-model="rock" :label="$t(filters.byIds.rock.label)" />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
          <input-text
            v-model="sample"
            :label="$t(filters.byIds.sample.label)"
          />
        </v-col>
        <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
          <input-text
            v-model="project"
            :label="$t(filters.byIds.project.label)"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" class="pt-5 d-flex flex-column">
          <span class="montserrat">{{ $t('common.parameters') }}</span>
        </v-col>
        <v-col
          v-for="(id, index) in parameterFilters.allIds"
          :key="id"
          cols="12"
        >
          <input-parameter
            :value="parameterFilters.byIds[id]"
            :parameters="parameterList(parameterFilters.byIds[id])"
            :disable-remove="parameterFilters.allIds.length <= 1"
            :disable-add="parameterFilters.allIds.length !== index + 1"
            @input="handleParameterUpdate($event, id)"
            @add:parameter="addParameterFilter"
            @remove:parameter="handleRemoveParameter(id)"
          />
        </v-col>
      </v-row> -->
    </search-fields-wrapper>
    <!-- <search-map
      site-overlay
      locality-overlay
      :items="items"
      class="mt-2"
      :active="geoJSON !== null"
      @update="handleMapUpdate"
    />
    <v-row no-gutters>
      <v-col cols="12">
        <search-institution-filter
          class="mt-2"
          :active="!isEmpty(institution)"
          :institution="institution"
          @change:institution="handleInstitutionsUpdate"
        />
      </v-col>
    </v-row> -->
  </v-form>
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
// import SearchInstitutionFilter from '~/components/search/SearchInstitutionFilter.vue'
// import InputText from '~/components/input/InputText.vue'
// import InputAutocompleteStratigraphy from '~/components/input/InputAutocompleteStratigraphy.vue'
// import InputRange from '~/components/input/InputRange.vue'
// import InputParameter from '~/components/input/InputParameter.vue'
// import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputParameter from '~/components/filter/input/FilterInputParameter.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterStratigraphy from '~/components/filter/FilterStratigraphy.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import { useFilter } from '~/composables/useFilter'
import { useHydrateFilterStratigraphy } from '~/composables/useHydrateFilter'
export default defineComponent({
  name: 'SearchFormAnalyticalData',
  fetchOnServer: false,
  components: {
    // SearchInstitutionFilter,
    // InputRange,
    // InputAutocompleteStratigraphy,
    // InputText,
    // InputParameter,
    SearchFieldsWrapper,
    SearchActions,
    // SearchMap,
    InputSearch,
    FilterInputParameter,
    FilterInputRange,
    FilterStratigraphy,
    FilterMap,
    FilterInstitution,
  },
  // async fetch() {
  //   if (isEmpty(this.parameters)) {
  //     const listParametersResponse =
  //       await this.$services.sarvSolr.getResourceList('analysis_parameter', {
  //         defaultParams: {
  //           fq: 'is_null:false',
  //         },
  //         options: {
  //           page: 1,
  //           itemsPerPage: 1000,
  //         },
  //       })
  //     this.setParameters({ parameters: listParametersResponse?.items })
  //   }
  // },
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
    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleSearch()
      },
    })
    const state = reactive({
      parameterSuggestions: [] as any[],
    })
    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()
    useFetch(async () => {
      const listParametersResponse = await $services.sarvSolr.getResourceList(
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
      const parameters = listParametersResponse.items.reduce(
        (prev: any, parameter: any) => {
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
        },
        {}
      )
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

      if (route.value.query.stratigraphyHierarchy) {
        stratigraphyHierarchy.value = (
          await hydrateFilterStratigraphy(
            (route.value.query.stratigraphyHierarchy as string)
              .split(',')
              .map((encodedValue) => decodeURIComponent(encodedValue))
          )
        ).data.response.docs
      }
      if (route.value.query.lithostratigraphyHierarchy) {
        lithostratigraphyHierarchy.value = (
          await hydrateFilterStratigraphy(
            (route.value.query.lithostratigraphyHierarchy as string)
              .split(',')
              .map((encodedValue) => decodeURIComponent(encodedValue))
          )
        ).data.response.docs
      }
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
      handleSearch,
      handleReset,
    }
  },
  // methods: {
  //   ...mapActions('search', ['resetFilters']),
  //   ...mapActions('search/analytical_data', [
  //     'searchAnalyticalData',
  //     'setParameters',
  //     'addParameterFilter',
  //     'updateParameterFilter',
  //     'removeParameterFilter',
  //   ]),
  //   ...mapActions('headers/analytical_data', ['removeHeader']),
  //   handleMapUpdate() {
  //     this.$emit('update')
  //   },
  //   handleInstitutionsUpdate(newInstitutions) {
  //     this.institution = newInstitutions
  //     this.$emit('update')
  //   },
  //   handleParameterUpdate(e, id) {
  //     this.updateParameterFilter({ id, filter: e })
  //   },
  //   handleRemoveParameter(id) {
  //     this.removeParameterFilter(id)
  //     // OLD
  //     // removeActiveListParameter({ filterName: entity.id, index })
  //   },
  // },
})
</script>
