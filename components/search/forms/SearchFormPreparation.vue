<template>
  <div>
    <v-form @submit.prevent="handleSearch">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <search-fields-wrapper>
        <v-card class="mt-3" flat tile color="transparent">
          <v-expansion-panels accordion flat tile multiple>
            <filter-input-text
              v-model="number"
              :title="$t('filters.preparationNumber').toString()"
            />
            <filter-locality v-model="locality" />
            <filter-map
              v-model="map"
              :items="$accessor.search.preparation.items"
            />

            <filter-input-range
              v-model="depth"
              :label="$t('filters.depth').toString()"
              interval-labels="intervals.depth"
              :step="0.01"
            />
            <filter-stratigraphy v-model="stratigraphyHierarchy" />
          </v-expansion-panels>
        </v-card>
      </search-fields-wrapper>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import { useFilter } from '~/composables/useFilter'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterLocality from '~/components/filter/FilterLocality.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterStratigraphy from '~/components/filter/FilterStratigraphy.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import {
  useHydrateFilterLocality,
  useHydrateFilterStratigraphy,
} from '~/composables/useHydrateFilter'
export default defineComponent({
  name: 'SearchFormPreparation',
  components: {
    SearchFieldsWrapper,
    SearchActions,
    FilterInputText,
    FilterInputRange,
    FilterStratigraphy,
    FilterMap,
    FilterLocality,
    InputSearch,
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const query = computed({
      get: () => $accessor.search.preparation.query,
      set: (val) => {
        $accessor.search.preparation.setQuery(val)
      },
    })
    const number = useFilter('preparation', 'number', handleSearch)
    const locality = useFilter('preparation', 'locality', handleSearch)
    const stratigraphyHierarchy = useFilter(
      'preparation',
      'stratigraphyHierarchy',
      handleSearch
    )
    const depth = useFilter('preparation', 'depth', handleSearch)
    const map = useFilter('preparation', 'map', handleSearch)
    const hydrateFilterLocality = useHydrateFilterLocality()
    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()
    useFetch(async () => {
      await hydrateFilterLocality(locality, 'locality')
      await hydrateFilterStratigraphy(
        stratigraphyHierarchy,
        'startigraphyHierarchy'
      )
    })
    return {
      handleReset,
      query,
      number,
      locality,
      stratigraphyHierarchy,
      depth,
      map,
      handleSearch,
    }
  },
})
</script>
