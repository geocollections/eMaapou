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
          <v-col cols="4" class="pr-3">
            <autocomplete-field
              :label="$t('analyticalData.parameter')"
              :items="distinctListParameters(entity)"
              return-object
              item-text="parameter"
              :value="entity"
              remove-clearable
              @input="
                updateActiveListParameters({ event: $event, index: index })
              "
            />
          </v-col>

          <v-col cols="6" class="pl-3">
            <v-row no-gutters>
              <v-col cols="12">
                <text-field
                  :label="$t('common.textField')"
                  :value="entity.text"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="1" align-self="center" class="text-center">
            <v-btn
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
              icon
              color="error"
              :disabled="activeListParameters.length <= 1"
              @click="removeActiveListParameter(index)"
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
      'activeListParameters',
      'shownActiveListParameters',
    ]),
    ...mapGetters('analyticalData', ['distinctListParameters']),
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
      'updateActiveListParameters',
      'addActiveListParameter',
      'removeActiveListParameter',
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
