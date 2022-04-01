<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />

    <search-fields-wrapper :active="hasActiveFilters('analytical_data')">
      <v-row no-gutters>
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
          <input-autocomplete
            v-model="stratigraphy"
            :items="autocomplete.chronostratigraphy"
            :loading="autocomplete.loaders.chronostratigraphy"
            :label="$t(filters.byIds.stratigraphy.label)"
            :item-text="stratigraphyLabel"
            @search:items="autocompleteChronostratigraphySearch"
          />
        </v-col>
        <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
          <input-autocomplete
            v-model="lithostratigraphy"
            :items="autocomplete.lithostratigraphy"
            :loading="autocomplete.loaders.lithostratigraphy"
            :label="$t(filters.byIds.lithostratigraphy.label)"
            :item-text="stratigraphyLabel"
            @search:items="autocompleteLithostratigraphySearch"
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
          :key="index"
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
      </v-row>

      <!-- <v-row no-gutters>
        <v-col cols="12">
          <input-autocomplete
            :label="$t('analyticalData.columns')"
            chips
            clearable
            multiple
            :items="listParameters"
            :value="shownActiveListParameters"
            return-object
            item-text="label"
            small-chips
            deletable-chips
            @input="updateAnalyticalDataHeaders"
          />
        </v-col>
      </v-row> -->
    </search-fields-wrapper>
    <search-map
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
          @change:institution="institution = $event"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import isEmpty from 'lodash/isEmpty'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import SearchInstitutionFilter from '~/components/search/SearchInstitutionFilter'
import InputText from '~/components/input/InputText.vue'
import InputAutocomplete from '~/components/input/InputAutocomplete'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import InputRange from '~/components/input/InputRange'
import InputParameter from '~/components/input/InputParameter.vue'
import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'
export default {
  name: 'SearchFormAnalyticalData',
  fetchOnServer: false,
  components: {
    SearchInstitutionFilter,
    InputRange,
    InputAutocomplete,
    InputText,
    InputParameter,
    SearchFieldsWrapper,
    SearchActions,
    SearchMap,
    InputSearch,
  },
  mixins: [autocompleteMixin],
  data() {
    return {
      autocomplete: {
        chronostratigraphy: [],
        lithostratigraphy: [],
        loaders: {
          chronostratigraphy: false,
          lithostratigraphy: false,
        },
      },
    }
  },
  async fetch() {
    if (isEmpty(this.parameters)) {
      const listParametersResponse =
        await this.$services.sarvSolr.getResourceList('analysis_parameter', {
          defaultParams: {
            fq: 'is_null:false',
          },
          options: {
            page: 1,
            itemsPerPage: 1000,
          },
        })
      this.setParameters({ parameters: listParametersResponse?.items })
    }
  },
  computed: {
    ...mapState('search/analytical_data', [
      'filters',
      'count',
      'items',
      'parameters',
      'parameterFilters',
    ]),
    ...mapGetters('search/analytical_data', ['parameterList']),
    ...mapGetters('search', ['hasActiveFilters']),
    ...mapFields('search/analytical_data', {
      locality: 'filters.byIds.locality.value',
      depth: 'filters.byIds.depth.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      lithostratigraphy: 'filters.byIds.lithostratigraphy.value',
      analysis: 'filters.byIds.analysis.value',
      method: 'filters.byIds.method.value',
      lab: 'filters.byIds.lab.value',
      agentAnalysed: 'filters.byIds.agentAnalysed.value',
      reference: 'filters.byIds.reference.value',
      dataset: 'filters.byIds.dataset.value',
      stratigraphyBed: 'filters.byIds.stratigraphyBed.value',
      rock: 'filters.byIds.rock.value',
      sample: 'filters.byIds.sample.value',
      project: 'filters.byIds.project.value',
      query: 'query',
    }),
    ...mapFields('search', {
      institution: 'globalFilters.byIds.institutions.value',
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
  },
  created() {
    this.fillAutocompleteLists()
  },
  methods: {
    isEmpty,
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/analytical_data', [
      'searchAnalyticalData',
      'setParameters',
      'addParameterFilter',
      'updateParameterFilter',
      'removeParameterFilter',
    ]),
    ...mapActions('headers/analytical_data', ['removeHeader']),
    async handleReset(e) {
      await this.resetFilters('analytical_data')
      this.searchAnalyticalData()
    },
    handleSearch(e) {
      this.searchAnalyticalData()
    },
    handleMapUpdate(tableState) {
      this.searchAnalyticalData(tableState?.options)
    },
    fillAutocompleteLists() {
      if (this.stratigraphy)
        this.autocomplete.chronostratigraphy.push(this.stratigraphy)
      if (this.lithostratigraphy)
        this.autocomplete.lithostratigraphy.push(this.lithostratigraphy)
    },
    handleParameterUpdate(e, id) {
      this.updateParameterFilter({ id, filter: e })
    },
    handleRemoveParameter(id) {
      this.removeParameterFilter(id)
      // OLD
      // removeActiveListParameter({ filterName: entity.id, index })
    },
  },
}
</script>
