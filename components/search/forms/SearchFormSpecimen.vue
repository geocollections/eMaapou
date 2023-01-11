<template>
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
          <filter-locality v-model="locality" />

          <filter-map
            v-model="map"
            sample-overlay
            :items="$accessor.search.specimen.items"
          />
          <filter-stratigraphy v-model="stratigraphyHierarchy" />
          <filter-taxon v-model="taxonHierarchy" />
          <filter-input-text
            v-model="taxonName"
            :title="$t('filters.taxonName').toString()"
          />
          <filter-fossil-group v-if="false" v-model="fossilGroup" />
          <filter-reference v-model="reference" />
          <filter-input-text
            v-model="collectionNumber"
            :title="$t('filters.collectionNumber').toString()"
          />
          <filter-institution v-model="institutions" />
        </v-expansion-panels>
      </v-card>
    </search-fields-wrapper>
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
import {
  useHydrateFilterLocality,
  useHydrateFilterReference,
  useHydrateFilterStratigraphy,
  useHydrateFilterTaxon,
} from '~/composables/useHydrateFilter'
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
    const number = useFilter('specimen', 'number', handleSearch)
    const locality = useFilter('specimen', 'locality', handleSearch)
    const reference = useFilter('specimen', 'reference', handleSearch)
    const taxonHierarchy = useFilter('specimen', 'taxonHierarchy', handleSearch)
    const collectionNumber = useFilter(
      'specimen',
      'collectionNumber',
      handleSearch
    )
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
    const institutions = computed({
      get: () => $accessor.search.globalFilters.byIds.institutions.value,
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

    useFetch(async () => {
      if (route.value.query.locality) {
        locality.value = (
          await hydrateFilterLocality(
            (route.value.query.locality as string).split(',').map(Number)
          )
        ).data.response.docs
      }

      if (route.value.query.reference) {
        reference.value = (
          await hydrateFilterReference(
            (route.value.query.reference as string)
              .split(',')
              .map((encodedValue) => decodeURIComponent(encodedValue))
          )
        ).data.response.docs
      }
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
      if (route.value.query.taxonName) {
        taxonName.value = (route.value.query.taxonName as string)
          .split(',')
          .map((encodedValue) => decodeURIComponent(encodedValue))
      }
      if (route.value.query.collectionNumber) {
        collectionNumber.value = (route.value.query.collectionNumber as string)
          .split(',')
          .map((encodedValue) => decodeURIComponent(encodedValue))
      }
    })

    return {
      handleReset,
      handleSearch,
      locality,
      reference,
      fossilGroup,
      taxonHierarchy,
      stratigraphyHierarchy,
      taxonName,
      collectionNumber,
      hasCoordinates,
      hasImage,
      institutions,
      query,
      map,
      number,
    }
  },
})
</script>
