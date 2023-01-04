<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />
    <search-fields-wrapper>
      <v-card class="mt-3" flat tile color="transparent">
        <v-expansion-panels accordion flat tile multiple>
          <filter-input-text
            :title="$t('filters.sampleNumber').toString()"
            :init-selection="number"
            @input="handleNumberFilterUpdate"
          />
          <filter-locality
            :selected="localities"
            @input="handleLocalityFilterUpdate"
          />
          <search-map
            sample-overlay
            :items="$accessor.search.sample.items"
            :active="false"
            @update="handleMapUpdate"
          />
          <filter-input-range
            v-model="depth"
            :label="$t('filters.depth').toString()"
          />
          <filter-stratigraphy
            :selected="stratigraphyHierarchy"
            @input="handleStratigraphyHierarchyFilterUpdate"
          />
          <filter-input-text
            :title="$t('filters.collector').toString()"
            :init-selection="collector"
            @input="handleCollectorFilterUpdate"
          />
          <filter-institution
            :institution="institution"
            @change:institution="handleInstitutionsUpdate"
          />
        </v-expansion-panels>
      </v-card>
      <!-- <input-text v-model="number" :label="$t(filters.byIds.number.label)" />

      <input-text
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />

      <input-autocomplete-stratigraphy
        v-model="hierarchy"
        return-object
        :label="$t(filters.byIds.hierarchy.label)"
      />

      <input-text
        v-model="collector"
        :label="$t(filters.byIds.collector.label)"
      />
      <input-range v-model="depth" :label="$t(filters.byIds.depth.label)" />

      <input-text v-model="mass" :label="$t(filters.byIds.mass.label)" />
      <input-text v-model="project" :label="$t(filters.byIds.project.label)" /> -->
    </search-fields-wrapper>
  </v-form>
</template>

<script lang="ts">
import { mapState, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import isEmpty from 'lodash/isEmpty'

import {
  computed,
  defineComponent,
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterStratigraphy from '~/components/filter/FilterStratigraphy.vue'
// import InputRange from '~/components/input/InputRange.vue'
// import InputText from '~/components/input/InputText.vue'
// import InputAutocompleteStratigraphy from '~/components/input/InputAutocompleteStratigraphy.vue'
import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterLocality from '~/components/filter/FilterLocality.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
export default defineComponent({
  name: 'SearchFormSample',
  components: {
    FilterInstitution,
    FilterLocality,
    FilterStratigraphy,
    FilterInputRange,
    FilterInputText,
    // InputAutocompleteStratigraphy,
    // InputText,
    // InputRange,
    SearchFieldsWrapper,
    SearchActions,
    SearchMap,
    InputSearch,
  },
  setup(_props, { emit }) {
    const { $accessor, $axios } = useContext()
    const route = useRoute()
    const hydrateLocalitySelection = (selectedIds: number[]) => {
      const idQuery = selectedIds.join(' ')
      return $axios.get(
        `https://api.geoloogia.info/solr/locality?q=id:(${idQuery})&rows=${selectedIds.length}&fl=locality,id,locality_en`
      )
    }

    const hydrateStratigraphySelection = (selectedStratigraphy: string[]) => {
      const query = selectedStratigraphy
        .map((stratigraphy) => `hierarchy_string:"${stratigraphy}"`)
        .join(' OR ')
      return $axios.get(
        `https://api.geoloogia.info/solr/stratigraphy?q=(${query})&rows=${selectedStratigraphy.length}&fl=id,stratigraphy,stratigraphy_en,hierarchy_string`
      )
    }

    useFetch(async () => {
      if (route.value.query.localities) {
        localities.value = (
          await hydrateLocalitySelection(
            (route.value.query.localities as string).split(',').map(Number)
          )
        ).data.response.docs
      }

      if (route.value.query.stratigraphyHierarchy) {
        stratigraphyHierarchy.value = (
          await hydrateStratigraphySelection(
            (route.value.query.stratigraphyHierarchy as string)
              .split(',')
              .map((encodedValue) => decodeURIComponent(encodedValue))
          )
        ).data.response.docs
      }
    })

    const localities = computed({
      get: () => $accessor.search.sample.filters.byIds.localities.value,
      set: (val) => {
        $accessor.search.sample.setFilterValue({
          key: 'localities',
          value: val,
        })
      },
    })
    const stratigraphyHierarchy = computed({
      get: () =>
        $accessor.search.sample.filters.byIds.stratigraphyHierarchy.value,
      set: (val) => {
        $accessor.search.sample.setFilterValue({
          key: 'stratigraphyHierarchy',
          value: val,
        })
      },
    })
    const number = computed({
      get: () => $accessor.search.sample.filters.byIds.number.value,
      set: (val) => {
        $accessor.search.sample.setFilterValue({
          key: 'number',
          value: val,
        })
      },
    })
    const collector = computed({
      get: () => $accessor.search.sample.filters.byIds.collector.value,
      set: (val) => {
        $accessor.search.sample.setFilterValue({
          key: 'collector',
          value: val,
        })
      },
    })
    const depth = computed({
      get: () => $accessor.search.sample.filters.byIds.depth.value,
      set: (val) => {
        $accessor.search.sample.setFilterValue({
          key: 'depth',
          value: val,
        })
      },
    })
    const institutions = computed({
      get: () => $accessor.search.globalFilters.byIds.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
      },
    })
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const handleMapUpdate = () => {
      emit('update')
    }
    const handleLocalityFilterUpdate = (event: any) => {
      localities.value = event
      handleSearch()
    }
    const handleInstitutionsUpdate = (newInstitutions: any[]) => {
      institutions.value = newInstitutions
      emit('update')
    }
    const handleStratigraphyHierarchyFilterUpdate = (event: any) => {
      stratigraphyHierarchy.value = event
      handleSearch()
    }
    const handleNumberFilterUpdate = (event: any) => {
      number.value = event
      handleSearch()
    }
    const handleCollectorFilterUpdate = (event: any) => {
      collector.value = event
      handleSearch()
    }
    const handleDepthFilterUpdate = (event: any) => {
      depth.value = event
      handleSearch()
    }
    return {
      localities,
      stratigraphyHierarchy,
      number,
      collector,
      handleReset,
      handleSearch,
      handleMapUpdate,
      handleInstitutionsUpdate,
      handleLocalityFilterUpdate,
      handleStratigraphyHierarchyFilterUpdate,
      handleDepthFilterUpdate,
      handleNumberFilterUpdate,
      handleCollectorFilterUpdate,
      isEmpty,
    }
  },
  computed: {
    ...mapState('search/sample', ['filters', 'items']),
    ...mapFields('search/sample', {
      number: 'filters.byIds.number.value',
      locality: 'filters.byIds.locality.value',
      stratigraphy: 'filters.byIds.stratigraphy.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      depth: 'filters.byIds.depth.value',
      collector: 'filters.byIds.collector.value',
      mass: 'filters.byIds.mass.value',
      project: 'filters.byIds.project.value',
      query: 'query',
    }),
    ...mapFields('search', {
      institution: 'globalFilters.byIds.institutions.value',
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('search/sample', ['hasActiveFilters']),
  },
})
</script>
