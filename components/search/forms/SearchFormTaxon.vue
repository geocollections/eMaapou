<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels accordion flat tile multiple>
        <filter-input-text
          v-model="species"
          :title="$t('filters.species').toString()"
        />
        <filter-stratigraphy v-model="stratigraphyHierarchy" />
        <filter-taxon v-model="taxonHierarchy" />
        <filter-map
          v-model="map"
          locality-overlay
          :items="$accessor.search.taxon.items"
        />

        <filter-input-text
          v-model="author"
          :title="$t('filters.author').toString()"
        />
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
import FilterStratigraphy from '~/components/filter/FilterStratigraphy.vue'
import FilterTaxon from '~/components/filter/FilterTaxon.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import {
  useHydrateFilterStratigraphy,
  useHydrateFilterTaxon,
} from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
export default defineComponent({
  name: 'SearchFormTaxon',
  components: {
    SearchActions,
    InputSearch,
    FilterStratigraphy,
    FilterTaxon,
    FilterMap,
    FilterInputText,
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
      get: () => $accessor.search.taxon.query,
      set: (val) => {
        $accessor.search.taxon.setQuery(val)
      },
    })
    const stratigraphyHierarchy = useFilter(
      'taxon',
      'stratigraphyHierarchy',
      handleUpdate
    )
    const author = useFilter('taxon', 'author', handleUpdate)
    const species = useFilter('taxon', 'species', handleUpdate)
    const taxonHierarchy = useFilter('taxon', 'taxonHierarchy', handleUpdate)
    const map = useFilter('taxon', 'map', handleUpdate)

    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()
    const hydrateFilterTaxon = useHydrateFilterTaxon()

    watch(() => route.value.query, () => fetch())

    const {fetch} = useFetch(async () => {
      emitUpdate.value = false
      await Promise.all([
        hydrateFilterTaxon(taxonHierarchy, 'taxonHierarchy'),
        hydrateFilterStratigraphy(
          stratigraphyHierarchy,
          'stratigraphyHierarchy'
        ),
      ])
      emitUpdate.value = true
    })
    return {
      query,
      stratigraphyHierarchy,
      taxonHierarchy,
      map,
      species,
      author,
      handleReset,
      handleUpdate,
    }
  },
})
</script>
