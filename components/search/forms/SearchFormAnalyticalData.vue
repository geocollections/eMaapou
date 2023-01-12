<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />

    <search-fields-wrapper>
      <v-card class="mt-3" flat tile color="transparent">
        <v-expansion-panels accordion flat tile multiple>
          <filter-input-parameter
            v-model="parameter"
            :parameters="parameterSuggestions"
          />
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
import { useFilter } from '~/composables/useFilter'
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
    const parameter = useFilter('analyticalData', 'parameter', handleSearch)

    const state = reactive({
      parameterSuggestions: [] as any[],
    })
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
      state.parameterSuggestions = listParametersResponse.items.map(
        (parameter: any) => {
          return {
            ...parameter,
            // Issue #930
            parameter_index: parameter.parameter_index.replace(/\W/g, '_'),
          }
        }
      )
    })
    return {
      ...toRefs(state),
      query,
      parameter,
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
