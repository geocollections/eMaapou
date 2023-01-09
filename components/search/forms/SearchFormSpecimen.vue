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
    const hydrateFilterLocality = useHydrateFilterLocality()
    const hydrateFilterReference = useHydrateFilterReference()
    const hydrateFilterTaxon = useHydrateFilterTaxon()
    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()

    useFetch(async () => {
      if (route.value.query.localities) {
        locality.value = (
          await hydrateFilterLocality(
            (route.value.query.localities as string).split(',').map(Number)
          )
        ).data.response.docs
      }

      if (route.value.query.references) {
        reference.value = (
          await hydrateFilterReference(
            (route.value.query.references as string)
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
    const locality = computed({
      get: () => $accessor.search.specimen.filters.byIds.locality.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'locality',
          value: val,
        })
        handleSearch()
      },
    })
    const reference = computed({
      get: () => $accessor.search.specimen.filters.byIds.reference.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'reference',
          value: val,
        })
        handleSearch()
      },
    })
    const taxonHierarchy = computed({
      get: () => $accessor.search.specimen.filters.byIds.taxonHierarchy.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'taxonHierarchy',
          value: val,
        })
        handleSearch()
      },
    })
    const collectionNumber = computed({
      get: () => $accessor.search.specimen.filters.byIds.collectionNumber.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'collectionNumber',
          value: val,
        })
        handleSearch()
      },
    })
    const taxonName = computed({
      get: () => $accessor.search.specimen.filters.byIds.taxonName.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'taxonName',
          value: val,
        })
        handleSearch()
      },
    })
    const stratigraphyHierarchy = computed({
      get: () =>
        $accessor.search.specimen.filters.byIds.stratigraphyHierarchy.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'stratigraphyHierarchy',
          value: val,
        })
        handleSearch()
      },
    })
    const fossilGroup = computed({
      get: () => $accessor.search.specimen.filters.byIds.fossilGroup.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'fossilGroup',
          value: val,
        })
        handleSearch()
      },
    })
    const hasImage = computed({
      get: () => $accessor.search.specimen.filters.byIds.hasImage.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'hasImage',
          value: val,
        })
        handleSearch()
      },
    })
    const hasCoordinates = computed({
      get: () => $accessor.search.specimen.filters.byIds.hasCoordinates.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'hasCoordinates',
          value: val,
        })
        handleSearch()
      },
    })
    const map = computed({
      get: () => $accessor.search.specimen.filters.byIds.map.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'map',
          value: val,
        })
        handleMapUpdate()
      },
    })
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
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const handleMapUpdate = () => {
      emit('update')
    }
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
      isEmpty,
      handleMapUpdate,
    }
  },
})
</script>
