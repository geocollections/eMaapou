<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <filter-input-checkbox
        v-model="hasImage"
        :label="$t('filters.hasImage').toString()"
      />
      <filter-input-checkbox
        v-model="hasCoordinates"
        :label="$t('filters.hasCoordinates').toString()"
      />
      <v-expansion-panels class="mt-3" accordion flat tile multiple>
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
        <filter-rock v-model="rockHierarchy" />
        <filter-input-text
          v-model="collector"
          :title="$t('filters.collector').toString()"
        />
        <filter-institution v-model="institutions" />
      </v-expansion-panels>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useFetch,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import SearchActions from '../SearchActions.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterStratigraphy from '~/components/filter/FilterStratigraphy.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterLocality from '~/components/filter/FilterLocality.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputCheckbox from '~/components/filter/input/FilterInputCheckbox.vue'
import FilterRock from '~/components/filter/FilterRock.vue'

import {
  useHydrateFilterLocality,
  useHydrateFilterRock,
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
    SearchActions,
    FilterMap,
    InputSearch,
    FilterInputCheckbox,
    FilterRock,
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const route = useRoute()
    const emitUpdate = ref(true)
    const hydrateFilters = ref(true)
    const handleReset = () => {
      emit('reset')
    }
    const handleUpdate = () => {
      if (!emitUpdate.value) return
      hydrateFilters.value = false
      emit('update')
    }
    const locality = useFilter('sample', 'locality', handleUpdate)
    const stratigraphyHierarchy = useFilter(
      'sample',
      'stratigraphyHierarchy',
      handleUpdate
    )
    const number = useFilter('sample', 'number', handleUpdate)
    const collector = useFilter('sample', 'collector', handleUpdate)
    const depth = useFilter('sample', 'depth', handleUpdate)
    const map = useFilter('sample', 'map', handleUpdate)
    const hasImage = useFilter('sample', 'hasImage', handleUpdate)
    const hasCoordinates = useFilter('sample', 'hasCoordinates', handleUpdate)
    const rockHierarchy = useFilter('sample', 'rockHierarchy', handleUpdate)
    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleUpdate()
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
    const hydrateFilterRock = useHydrateFilterRock()

    watch(
      () => route.value.query,
      () => {
        if (!hydrateFilters.value) {
          hydrateFilters.value = true
          return
        }
        fetch()
      }
    )

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false
      await Promise.all([
        hydrateFilterLocality(locality, 'locality'),
        hydrateFilterStratigraphy(
          stratigraphyHierarchy,
          'stratigraphyHierarchy'
        ),
        hydrateFilterRock(rockHierarchy, 'rockHierarchy'),
      ])
      emitUpdate.value = true
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
      hasImage,
      hasCoordinates,
      rockHierarchy,
      handleReset,
      handleUpdate,
    }
  },
})
</script>
