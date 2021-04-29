<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right mt-2">
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

    <v-row
      v-if="activeListParameters && activeListParameters.length > 0"
      no-gutters
    >
      <v-col
        v-for="(entity, index) in activeListParameters"
        :key="index"
        cols="12"
      >
        <v-row no-gutters>
          <v-col cols="4" class="pr-1">
            <autocomplete-field
              :label="$t('analyticalData.parameter')"
              :items="distinctListParameters(entity)"
              return-object
              item-text="parameter"
              :value="entity"
              remove-clearable
              do-not-cache
              @input="
                updateActiveListParameters({
                  event: $event,
                  keyToReplace: entity.parameter_index,
                  indexToReplace: index,
                })
              "
            />
          </v-col>

          <v-col v-if="entity.isText" cols="6">
            <v-row no-gutters>
              <v-col cols="12" class="pr-1">
                <text-field
                  :label="$t('common.textField')"
                  :value="entity.text"
                  @input="
                    updateActiveParam({
                      value: $event,
                      field: 'text',
                      index: index,
                    })
                  "
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col v-else cols="6">
            <v-row no-gutters>
              <v-col cols="6" class="px-1">
                <number-field
                  :label="$t(entity.placeholders[0])"
                  step="0.1"
                  :value="entity.value[0]"
                  @input="
                    updateActiveParam({
                      value: [parseInput($event), entity.value[1]],
                      key: entity.parameter_index,
                    })
                  "
                />
              </v-col>

              <v-col cols="6" class="px-1">
                <number-field
                  :label="$t(entity.placeholders[1])"
                  step="0.1"
                  :value="entity.value[1]"
                  @input="
                    updateActiveParam({
                      value: [entity.value[0], parseInput($event)],
                      key: entity.parameter_index,
                    })
                  "
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="1" align-self="center" class="text-center">
            <v-btn
              small
              icon
              color="success"
              :disabled="activeListParameters.length >= 10"
              @click="addActiveListParameter"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="1" align-self="center" class="text-center">
            <v-btn
              small
              icon
              color="error"
              :disabled="activeListParameters.length <= 1"
              @click="
                removeActiveListParameter({
                  index,
                  filterName: entity.parameter_index,
                })
              "
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
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
          item-text="parameter"
          small-chips
          deletable-chips
          @input="updateAnalyticalDataHeaders"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import { isEmpty } from 'lodash'
import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'
import TextField from '~/components/fields/TextField.vue'
import AutocompleteField from '~/components/fields/AutocompleteField'
import autocompleteMixin from '~/mixins/autocompleteMixin'
import NumberField from '~/components/fields/NumberField'
import RangeTextField from '~/components/fields/RangeTextField'

export default {
  name: 'AnalyticalDataSearchForm',
  components: {
    RangeTextField,
    NumberField,
    AutocompleteField,
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
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
            fq: 'id_l:[2 TO *]', // Because first one is N/A
          },
        }
      )
      this.setListParameters(listParametersResponse?.items)
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
      reference: 'filters.byIds.reference.value',
      dataset: 'filters.byIds.dataset.value',
      stratigraphyBed: 'filters.byIds.stratigraphyBed.value',
      rock: 'filters.byIds.rock.value',
      sample: 'filters.byIds.sample.value',
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
      'updateActiveListParameters',
      'addActiveListParameter',
      'removeActiveListParameter',
      'updateActiveParam',
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
  },
}
</script>
