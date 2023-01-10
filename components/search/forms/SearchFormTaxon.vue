<template>
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
      <!-- <input-text v-model="species" :label="$t(filters.byIds.species.label)" />

      <input-text
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />

      <input-autocomplete-stratigraphy
        v-model="stratigraphyHierarchy"
        return-object
        :label="$t(filters.byIds.stratigraphyHierarchy.label)"
      />

      <input-autocomplete-taxon
        v-model="taxonHierarchy"
        :label="$t(filters.byIds.taxonHierarchy.label)"
      />

      <input-text v-model="author" :label="$t(filters.byIds.author.label)" /> -->
    </search-fields-wrapper>
    <!-- <search-map
      locality-overlay
      :items="items"
      class="mt-2"
      :active="geoJSON !== null"
      @update="handleMapUpdate"
    /> -->
  </v-form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
// import InputText from '~/components/input/InputText.vue'
// import InputAutocompleteStratigraphy from '~/components/input/InputAutocompleteStratigraphy.vue'
// import InputAutocompleteTaxon from '~/components/input/InputAutocompleteTaxon.vue'
// import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterStratigraphy from '~/components/filter/FilterStratigraphy.vue'
import FilterTaxon from '~/components/filter/FilterTaxon.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import {
  useHydrateFilterStratigraphy,
  useHydrateFilterTaxon,
} from '~/composables/useHydrateFilter'
export default defineComponent({
  name: 'SearchFormTaxon',
  components: {
    // InputAutocompleteStratigraphy,
    // InputAutocompleteTaxon,
    // InputText,
    SearchFieldsWrapper,
    SearchActions,
    // SearchMap,
    InputSearch,
    FilterStratigraphy,
    FilterTaxon,
    FilterMap,
    FilterInputText,
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
    const handleMapUpdate = () => {
      emit('update')
    }
    const query = computed({
      get: () => $accessor.search.taxon.query,
      set: (val) => {
        $accessor.search.taxon.setQuery(val)
      },
    })
    const stratigraphyHierarchy = computed({
      get: () =>
        $accessor.search.taxon.filters.byIds.stratigraphyHierarchy.value,
      set: (value) => {
        $accessor.search.taxon.setFilterValue({
          key: 'stratigraphyHierarchy',
          value,
        })
        handleSearch()
      },
    })

    const author = computed({
      get: () => $accessor.search.taxon.filters.byIds.author.value,
      set: (value) => {
        $accessor.search.taxon.setFilterValue({
          key: 'author',
          value,
        })
        handleSearch()
      },
    })
    const species = computed({
      get: () => $accessor.search.taxon.filters.byIds.species.value,
      set: (value) => {
        $accessor.search.taxon.setFilterValue({
          key: 'species',
          value,
        })
        handleSearch()
      },
    })
    const taxonHierarchy = computed({
      get: () => $accessor.search.taxon.filters.byIds.taxonHierarchy.value,
      set: (value) => {
        $accessor.search.taxon.setFilterValue({
          key: 'taxonHierarchy',
          value,
        })
        handleSearch()
      },
    })
    const map = computed({
      get: () => $accessor.search.taxon.filters.byIds.map.value,
      set: (value) => {
        $accessor.search.taxon.setFilterValue({
          key: 'map',
          value,
        })
        handleSearch()
      },
    })

    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()
    const hydrateFilterTaxon = useHydrateFilterTaxon()
    useFetch(async () => {
      if (route.value.query.taxonHierarchy) {
        taxonHierarchy.value = (
          await hydrateFilterTaxon(
            (route.value.query.taxonHierarchy as string)
              .split(',')
              .map((encodedValue) => decodeURIComponent(encodedValue))
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
