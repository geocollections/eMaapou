<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="mt-2 d-flex justify-end align-center">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>

    <v-row no-gutters>
      <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
        <text-field
          v-model="locality"
          :label="$t(filters.byIds.locality.label)"
        />
      </v-col>
      <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
        <range-text-field
          v-model="depth"
          :label="$t(filters.byIds.depth.label)"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
        <autocomplete-field
          v-model="stratigraphy"
          :items="autocomplete.chronostratigraphy"
          :loading="autocomplete.loaders.chronostratigraphy"
          :label="$t(filters.byIds.stratigraphy.label)"
          :item-text="stratigraphyLabel"
          @search:items="autocompleteChronostratigraphySearch"
        />
      </v-col>
      <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
        <autocomplete-field
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
        <text-field
          v-model="analysis"
          :label="$t(filters.byIds.analysis.label)"
        />
      </v-col>
      <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
        <text-field v-model="method" :label="$t(filters.byIds.method.label)" />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
        <text-field v-model="lab" :label="$t(filters.byIds.lab.label)" />
      </v-col>
      <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
        <text-field
          v-model="agentAnalysed"
          :label="$t(filters.byIds.agentAnalysed.label)"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
        <text-field
          v-model="reference"
          :label="$t(filters.byIds.reference.label)"
        />
      </v-col>
      <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
        <text-field
          v-model="dataset"
          :label="$t(filters.byIds.dataset.label)"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
        <text-field
          v-model="stratigraphyBed"
          :label="$t(filters.byIds.stratigraphyBed.label)"
        />
      </v-col>
      <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
        <text-field v-model="rock" :label="$t(filters.byIds.rock.label)" />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
        <text-field v-model="sample" :label="$t(filters.byIds.sample.label)" />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col
        v-for="(entity, index) in activeListParameters"
        :key="index"
        cols="12"
      >
        <parameter-field
          :value="entity"
          :parameters="distinctListParameters(entity)"
          :disable-remove="activeListParameters.length <= 1"
          :disable-add="activeListParameters.length >= 10"
          @input="handleParameterUpdate($event, index)"
          @add:parameter="addActiveListParameter"
          @remove:parameter="
            removeActiveListParameter({ filterName: entity.id, index })
          "
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12">
        <autocomplete-field
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
    </v-row>

    <v-row no-gutters>
      <v-col cols="12">
        <institution-search-filter
          class="pt-1"
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

import { isEmpty } from 'lodash'
import InstitutionSearchFilter from '@/components/search/InstitutionSearchFilter'
import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'
import TextField from '~/components/fields/TextField.vue'
import AutocompleteField from '~/components/fields/AutocompleteField'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import RangeTextField from '~/components/fields/RangeTextField'
import ParameterField from '~/components/fields/ParameterField.vue'

export default {
  name: 'AnalyticalDataSearchForm',
  components: {
    InstitutionSearchFilter,
    RangeTextField,
    AutocompleteField,
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
    ParameterField,
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
    if (this.listParameters.length === 0) {
      const listParametersResponse = await this.$services.sarvSolr.getResourceList(
        'analysis_parameter',
        {
          defaultParams: {
            fq: 'is_null:false',
          },
        }
      )
      this.setListParameters({ parameters: listParametersResponse?.items })
    }
  },
  computed: {
    ...mapState('analyticalData', [
      'filters',
      'listParameters',
      'activeListParameters',
      'shownActiveListParameters',
    ]),
    ...mapGetters('analyticalData', ['distinctListParameters']),
    ...mapFields('analyticalData', {
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
    }),
    ...mapFields('globalSearch', {
      institution: 'filters.byIds.institution.value',
    }),
  },
  created() {
    this.fillAutocompleteLists()
  },
  methods: {
    ...mapActions('analyticalData', [
      'searchAnalyticalData',
      'resetAnalyticalDataFilters',
      'setListParameters',
      'updateAnalyticalDataHeaders',
      'addActiveListParameter',
      'removeActiveListParameter',
      'updateParameter',
    ]),
    ...mapActions('landing', ['resetSearch']),
    handleReset(e) {
      this.resetSearch()
      this.resetAnalyticalDataFilters()
      this.searchAnalyticalData()
    },
    handleSearch(e) {
      this.searchAnalyticalData()
    },
    parseInput(input) {
      if (isEmpty(input)) return null
      else return parseFloat(input)
    },
    fillAutocompleteLists() {
      if (this.stratigraphy)
        this.autocomplete.chronostratigraphy.push(this.stratigraphy)
      if (this.lithostratigraphy)
        this.autocomplete.lithostratigraphy.push(this.lithostratigraphy)
    },
    handleParameterUpdate(e, index) {
      this.updateParameter({ index, parameter: e })
    },
  },
}
</script>
