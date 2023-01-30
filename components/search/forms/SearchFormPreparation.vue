<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels accordion flat tile multiple>
        <filter-input-text
          v-model="number"
          :title="$t('filters.preparationNumber').toString()"
        />
        <filter-locality v-model="locality" />
        <filter-map v-model="map" :items="$accessor.search.preparation.items" />

        <filter-input-range
          v-model="depth"
          :label="$t('filters.depth').toString()"
          interval-labels="intervals.depth"
          :step="0.01"
        />
        <filter-stratigraphy v-model="stratigraphyHierarchy" />
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
    const route = useRoute()
    const emitUpdate = ref(true)
    const handleReset = () => {
      emit('reset')
    }
    const handleUpdate = () => {
      if (!emitUpdate.value) return
      emit('update')
    }
    const query = computed({
      get: () => $accessor.search.preparation.query,
      set: (val) => {
        $accessor.search.preparation.setQuery(val)
      },
    })
    const number = useFilter('preparation', 'number', handleUpdate)
    const locality = useFilter('preparation', 'locality', handleUpdate)
    const stratigraphyHierarchy = useFilter(
      'preparation',
      'stratigraphyHierarchy',
      handleUpdate
    )
    const depth = useFilter('preparation', 'depth', handleUpdate)
    const map = useFilter('preparation', 'map', handleUpdate)
    const hydrateFilterLocality = useHydrateFilterLocality()
    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()

    watch(() => route.value.query, () => fetch())

    const {fetch} = useFetch(async () => {
      emitUpdate.value = false
      await Promise.all([
        hydrateFilterLocality(locality, 'locality'),
        hydrateFilterStratigraphy(
          stratigraphyHierarchy,
          'startigraphyHierarchy'
        ),
      ])
      emitUpdate.value = true
    })
    return {
      handleReset,
      query,
      number,
      locality,
      stratigraphyHierarchy,
      depth,
      map,
      handleUpdate,
    }
  },
})
</script>
