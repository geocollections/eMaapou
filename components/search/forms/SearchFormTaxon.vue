<template>
  <div>
    <v-form @submit.prevent="handleSearch">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <search-fields-wrapper>
        <v-card class="mt-3" flat tile color="transparent">
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
    SearchFieldsWrapper,
    SearchActions,
    InputSearch,
    FilterStratigraphy,
    FilterTaxon,
    FilterMap,
    FilterInputText,
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const handleMapUpdate = () => {
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
      handleSearch
    )
    const author = useFilter('taxon', 'author', handleSearch)
    const species = useFilter('taxon', 'species', handleSearch)
    const taxonHierarchy = useFilter('taxon', 'taxonHierarchy', handleSearch)
    const map = useFilter('taxon', 'map', handleSearch)

    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()
    const hydrateFilterTaxon = useHydrateFilterTaxon()
    useFetch(async () => {
      await Promise.all([
        hydrateFilterTaxon(taxonHierarchy, 'taxonHierarchy'),
        hydrateFilterStratigraphy(
          stratigraphyHierarchy,
          'stratigraphyHierarchy'
        ),
      ])
    })
    return {
      query,
      stratigraphyHierarchy,
      taxonHierarchy,
      map,
      species,
      author,
      handleReset,
      handleSearch,
      handleMapUpdate,
    }
  },
})
</script>
