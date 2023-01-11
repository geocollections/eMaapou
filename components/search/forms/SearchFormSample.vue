<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />
    <search-fields-wrapper>
      <v-card class="mt-3" flat tile color="transparent">
        <v-expansion-panels accordion flat tile multiple>
          <filter-input-text
            v-model="number"
            :title="$t('filters.sampleNumber').toString()"
          />
          <filter-locality v-model="locality" />
          <filter-map
            v-model="map"
            sample-overlay
            :items="$accessor.search.sample.items"
          />
          <filter-input-range
            v-model="depth"
            :label="$t('filters.depth').toString()"
            interval-labels="intervals.depth"
            :step="0.01"
          />
          <filter-stratigraphy v-model="stratigraphyHierarchy" />
          <filter-input-text
            v-model="collector"
            :title="$t('filters.collector').toString()"
          />
          <filter-institution v-model="institutions" />
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
import InputSearch from '~/components/input/InputSearch.vue'
import FilterLocality from '~/components/filter/FilterLocality.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import {
  useHydrateFilterLocality,
  useHydrateFilterStratigraphy,
} from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
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
    FilterMap,
    InputSearch,
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const route = useRoute()

    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const locality = useFilter('sample', 'locality', handleSearch)
    const stratigraphyHierarchy = useFilter(
      'sample',
      'stratigraphyHierarchy',
      handleSearch
    )
    const number = useFilter('sample', 'number', handleSearch)
    const collector = useFilter('sample', 'collector', handleSearch)
    const depth = useFilter('sample', 'depth', handleSearch)
    const map = useFilter('sample', 'map', handleSearch)
    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleSearch()
      },
    })
    const query = computed({
      get: () => $accessor.search.sample.query,
      set: (val) => {
        $accessor.search.sample.setQuery(val)
      },
    })
    const hydrateFilterLocality = useHydrateFilterLocality()
    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()
    useFetch(async () => {
      if (route.value.query.locality) {
        locality.value = (
          await hydrateFilterLocality(
            (route.value.query.locality as string).split(',').map(Number)
          )
        ).data.response.docs
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
    })
    return {
      locality,
      stratigraphyHierarchy,
      number,
      depth,
      collector,
      institutions,
      query,
      map,
      handleReset,
      handleSearch,
      isEmpty,
    }
  },
})
</script>
