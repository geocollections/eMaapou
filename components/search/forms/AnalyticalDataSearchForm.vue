<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="text-right">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>

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
        <text-field v-model="method" :label="$t(filters.byIds.method.label)" />
      </v-col>
      <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
        <text-field
          v-model="reference"
          :label="$t(filters.byIds.reference.label)"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
        <text-field
          v-model="dataset"
          :label="$t(filters.byIds.dataset.label)"
        />
      </v-col>
      <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
        <text-field
          v-model="stratigraphyBed"
          :label="$t(filters.byIds.stratigraphyBed.label)"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" sm="6" md="12" class="pr-sm-3 pr-md-0">
        <text-field v-model="rock" :label="$t(filters.byIds.rock.label)" />
      </v-col>
      <v-col cols="12" sm="6" md="12" class="pl-sm-3 pl-md-0">
        <text-field v-model="sample" :label="$t(filters.byIds.sample.label)" />
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
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'
import TextField from '~/components/fields/TextField.vue'
import AutocompleteField from '~/components/fields/AutocompleteField'
import autocompleteMixin from '~/mixins/autocompleteMixin'

export default {
  name: 'AnalyticalDataSearchForm',
  components: {
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
    const listParametersResponse = await this.$services.sarvSolr.getResourceList(
      'analysis_parameter',
      {
        defaultParams: {
          fq: 'id_l:[2 TO *]', // Because first one is N/A
        },
      }
    )
    this.setListParameters(listParametersResponse?.items)
  },
  computed: {
    ...mapState('analyticalData', [
      'filters',
      'listParameters',
      'shownActiveListParameters',
    ]),
    ...mapFields('analyticalData', {
      stratigraphy: 'filters.byIds.stratigraphy.value',
      lithostratigraphy: 'filters.byIds.lithostratigraphy.value',
      method: 'filters.byIds.method.value',
      reference: 'filters.byIds.reference.value',
      dataset: 'filters.byIds.dataset.value',
      stratigraphyBed: 'filters.byIds.stratigraphyBed.value',
      rock: 'filters.byIds.rock.value',
      sample: 'filters.byIds.sample.value',
    }),
  },
  methods: {
    ...mapActions('analyticalData', [
      'searchAnalyticalData',
      'resetAnalyticalDataFilters',
      'setListParameters',
      'updateAnalyticalDataHeaders',
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
  },
}
</script>
