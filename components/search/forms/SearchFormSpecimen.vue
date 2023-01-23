<template>
  <div>
    <v-form @submit.prevent.stop="handleSearch">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <search-fields-wrapper>
        <filter-input-checkbox
          v-model="hasImage"
          :label="$t('filters.hasImage').toString()"
        />
        <filter-input-checkbox
          v-model="hasCoordinates"
          :label="$t('filters.hasCoordinates').toString()"
        />
        <v-card class="mt-3" flat tile color="transparent">
          <v-expansion-panels accordion flat tile multiple>
            <filter-input-text
              v-model="number"
              :title="$t('filters.specimenNumber').toString()"
            />
            <filter-collection v-model="collection" />
            <filter-taxon v-model="taxonHierarchy" />
            <filter-input-text
              v-model="taxonName"
              :title="$t('filters.taxonName').toString()"
            />
            <filter-fossil-group v-model="fossilGroup" />
            <filter-rock v-if="false" v-model="rockHierarchy" />
            <filter-locality v-model="locality" />
            <filter-input-autocomplete-static
              v-model="country"
              :title="$t('filters.country').toString()"
              :items="countrySuggestions"
              :filter-field="$translate({ et: 'text', en: 'text_en' })"
            />
            <filter-map
              v-model="map"
              sample-overlay
              :items="$accessor.search.specimen.items"
            />
            <filter-stratigraphy v-model="stratigraphyHierarchy" />
            <filter-input-range
              v-model="depth"
              :label="$t('filters.depth').toString()"
              interval-labels="intervals.depth"
              :step="0.01"
            />
            <filter-reference v-model="reference" />
            <filter-input-text
              v-model="collector"
              :title="$t('filters.collector').toString()"
            />
            <filter-input-autocomplete-static
              v-model="originalStatus"
              :title="$t('filters.originalStatus').toString()"
              :items="originalStatusSuggestions"
              :filter-field="$translate({ et: 'text', en: 'text_en' })"
            />
            <filter-institution v-model="institutions" />
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
  reactive,
  toRefs,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputCheckbox from '~/components/filter/input/FilterInputCheckbox.vue'
import FilterFossilGroup from '~/components/filter/FilterFossilGroup.vue'
import FilterLocality from '~/components/filter/FilterLocality.vue'
import FilterReference from '~/components/filter/FilterReference.vue'
import FilterStratigraphy from '~/components/filter/FilterStratigraphy.vue'
import FilterTaxon from '~/components/filter/FilterTaxon.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import FilterRock from '~/components/filter/FilterRock.vue'
import FilterCollection from '~/components/filter/FilterCollection.vue'
import {
  useHydrateFilterLocality,
  useHydrateFilterReference,
  useHydrateFilterStratigraphy,
  useHydrateFilterTaxon,
  useHydrateFilterTaxonId,
  useHydrateFilterRock,
  useHydrateFilterCollection,
  useHydrateFilterStatic,
} from '~/composables/useHydrateFilter'
import { useGetSuggestions } from '~/composables/useGetSuggestions'
import { useFilter } from '~/composables/useFilter'
export default defineComponent({
  name: 'SearchFormSpecimen',
  components: {
    FilterInputCheckbox,
    FilterMap,
    SearchFieldsWrapper,
    SearchActions,
    InputSearch,
    FilterInstitution,
    FilterFossilGroup,
    FilterLocality,
    FilterReference,
    FilterStratigraphy,
    FilterTaxon,
    FilterInputText,
    FilterInputRange,
    FilterInputAutocompleteStatic,
    FilterRock,
    FilterCollection,
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()

    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const number = useFilter('specimen', 'number', handleSearch)
    const locality = useFilter('specimen', 'locality', handleSearch)
    const reference = useFilter('specimen', 'reference', handleSearch)
    const taxonHierarchy = useFilter('specimen', 'taxonHierarchy', handleSearch)
    const collection = useFilter('specimen', 'collection', handleSearch)
    const taxonName = useFilter('specimen', 'taxonName', handleSearch)
    const stratigraphyHierarchy = useFilter(
      'specimen',
      'stratigraphyHierarchy',
      handleSearch
    )
    const fossilGroup = useFilter('specimen', 'fossilGroup', handleSearch)
    const hasImage = useFilter('specimen', 'hasImage', handleSearch)
    const hasCoordinates = useFilter('specimen', 'hasCoordinates', handleSearch)
    const map = useFilter('specimen', 'map', handleSearch)
    const depth = useFilter('specimen', 'depth', handleSearch)
    const country = useFilter('specimen', 'country', handleSearch)
    const rockHierarchy = useFilter('specimen', 'rockHierarchy', handleSearch)
    const originalStatus = useFilter('specimen', 'originalStatus', handleSearch)
    const collector = useFilter('specimen', 'collector', handleSearch)
    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleSearch()
      },
    })
    const query = computed({
      get: () => $accessor.search.specimen.query,
      set: (val) => {
        $accessor.search.specimen.setQuery(val)
      },
    })

    const hydrateFilterLocality = useHydrateFilterLocality()
    const hydrateFilterReference = useHydrateFilterReference()
    const hydrateFilterTaxon = useHydrateFilterTaxon()
    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()
    const hydrateFilterFossilGroup = useHydrateFilterTaxonId()
    const hydrateFilterRock = useHydrateFilterRock()
    const hydrateFilterCollection = useHydrateFilterCollection()
    const hydrateFilterStatic = useHydrateFilterStatic()

    const state = reactive({
      countrySuggestions: [] as any[],
      originalStatusSuggestions: [] as any[],
    })
    const getSuggestions = useGetSuggestions()

    useFetch(async () => {
      const suggestionPromise = Promise.all([
        getSuggestions('specimen', 'country_id,country,country_en', {
          et: 'country',
          en: 'country_en',
        }),
        getSuggestions(
          'specimen',
          'original_status_id,original_status,original_status_en',
          { et: 'original_status', en: 'original_status_en' }
        ),
      ])

      const hydrationPromise = Promise.all([
        hydrateFilterLocality(locality, 'locality'),
        hydrateFilterCollection(collection, 'collection'),
        hydrateFilterFossilGroup(fossilGroup, 'fossilGroup'),
        hydrateFilterReference(reference, 'reference'),
        hydrateFilterTaxon(taxonHierarchy, 'taxonHierarchy'),
        hydrateFilterRock(rockHierarchy, 'rockHierarchy'),
        hydrateFilterStratigraphy(
          stratigraphyHierarchy,
          'stratigraphyHierarchy'
        ),
      ])
      const [suggestionResults] = await Promise.all([
        suggestionPromise,
        hydrationPromise,
      ])

      state.countrySuggestions = suggestionResults[0]
      state.originalStatusSuggestions = suggestionResults[1]

      hydrateFilterStatic(country, 'country', state.countrySuggestions, Number)
      hydrateFilterStatic(
        originalStatus,
        'originalStatus',
        state.originalStatusSuggestions,
        Number
      )
    })

    return {
      ...toRefs(state),
      handleReset,
      handleSearch,
      locality,
      reference,
      fossilGroup,
      taxonHierarchy,
      stratigraphyHierarchy,
      taxonName,
      collection,
      hasCoordinates,
      hasImage,
      institutions,
      query,
      map,
      number,
      depth,
      country,
      rockHierarchy,
      originalStatus,
      collector,
    }
  },
})
</script>
