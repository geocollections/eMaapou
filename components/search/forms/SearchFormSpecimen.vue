<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />
    <search-fields-wrapper :active="$accessor.search.specimen.hasActiveFilters">
      <filter-input-checkbox
        :value="hasImage"
        :label="$t('filters.hasImage').toString()"
        @input="handleHasImageFilterUpdate"
      />
      <filter-input-checkbox
        :value="hasCoordinates"
        :label="$t('filters.hasCoordinates').toString()"
        @input="handleHasCoordinatesFilterUpdate"
      />
      <v-card class="mt-3" flat tile color="transparent">
        <v-expansion-panels accordion flat tile multiple>
          <filter-locality
            :selected="localities"
            @input="handleLocalityFilterUpdate"
          />
          <search-map
            sample-overlay
            :items="$accessor.search.specimen.items"
            :active="false"
            @update="handleMapUpdate"
          />
          <filter-stratigraphy
            :selected="stratigraphyHierarchy"
            @input="handleStratigraphyHierarchyFilterUpdate"
          />
          <filter-taxon
            :selected="taxonHierarchy"
            @input="handleTaxonHierarchyFilterUpdate"
          />
          <filter-input-text
            :title="$t('filters.taxonName').toString()"
            :init-selection="taxonName"
            @input="handleTaxonNameFilterUpdate"
          />
          <filter-fossil-group
            v-if="false"
            :selected="fossilGroups"
            @input="handleFossilGroupFilterUpdate"
          />
          <filter-reference
            :selected="references"
            @input="handleReferenceFilterUpdate"
          />
          <filter-input-text
            :title="$t('filters.collectionNumber').toString()"
            :init-selection="collectionNumber"
            @input="handleCollectionNumberFilterUpdate"
          />
          <filter-institution
            :institution="institutions"
            @change:institution="handleInstitutionsUpdate"
          />
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
import SearchMap from '~/components/search/SearchMap.vue'
import FilterInputCheckbox from '~/components/filter/input/FilterInputCheckbox.vue'
import FilterFossilGroup from '~/components/filter/FilterFossilGroup.vue'
import FilterLocality from '~/components/filter/FilterLocality.vue'
import FilterReference from '~/components/filter/FilterReference.vue'
import FilterStratigraphy from '~/components/filter/FilterStratigraphy.vue'
import FilterTaxon from '~/components/filter/FilterTaxon.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
export default defineComponent({
  name: 'SearchFormSpecimen',
  components: {
    FilterInputCheckbox,
    SearchMap,
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
    const { $axios, $accessor } = useContext()
    const route = useRoute()
    const hydrateLocalitySelection = (selectedIds: number[]) => {
      const idQuery = selectedIds.join(' ')
      return $axios.get(
        `https://api.geoloogia.info/solr/locality?q=id:(${idQuery})&rows=${selectedIds.length}&fl=locality,id,locality_en`
      )
    }
    const hydrateReferenceSelection = (selectedReferences: string[]) => {
      const query = selectedReferences
        .map((reference) => `reference:"${reference}"`)
        .join(' OR ')
      return $axios.get(
        `https://api.geoloogia.info/solr/reference?q=(${query})&rows=${selectedReferences.length}&fl=id,reference,title`
      )
    }
    const hydrateTaxonSelection = (selectedTaxa: string[]) => {
      const query = selectedTaxa
        .map((taxa) => `hierarchy_string:"${taxa}"`)
        .join(' OR ')
      return $axios.get(
        `https://api.geoloogia.info/solr/taxon?q=(${query})&rows=${selectedTaxa.length}&fl=id,taxon,hierarchy_string`
      )
    }
    const hydrateStratigraphySelection = (selectedStratigraphy: string[]) => {
      const query = selectedStratigraphy
        .map((stratigraphy) => `hierarchy_string:"${stratigraphy}"`)
        .join(' OR ')
      return $axios.get(
        `https://api.geoloogia.info/solr/stratigraphy?q=(${query})&rows=${selectedStratigraphy.length}&fl=id,stratigraphy,stratigraphy_en,hierarchy_string`
      )
    }
    useFetch(async () => {
      if (route.value.query.localities) {
        localities.value = (
          await hydrateLocalitySelection(
            (route.value.query.localities as string).split(',').map(Number)
          )
        ).data.response.docs
      }

      if (route.value.query.references) {
        references.value = (
          await hydrateReferenceSelection(
            (route.value.query.references as string)
              .split(',')
              .map((encodedValue) => decodeURIComponent(encodedValue))
          )
        ).data.response.docs
      }
      if (route.value.query.taxonHierarchy) {
        taxonHierarchy.value = (
          await hydrateTaxonSelection(
            (route.value.query.taxonHierarchy as string)
              .split(',')
              .map((encodedValue) => decodeURIComponent(encodedValue))
          )
        ).data.response.docs
      }
      if (route.value.query.stratigraphyHierarchy) {
        stratigraphyHierarchy.value = (
          await hydrateStratigraphySelection(
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
    const handleLocalityFilterUpdate = (event: any) => {
      localities.value = event
      handleSearch()
    }
    const handleReferenceFilterUpdate = (event: any) => {
      references.value = event
      handleSearch()
    }
    const handleTaxonHierarchyFilterUpdate = (event: any) => {
      taxonHierarchy.value = event
      handleSearch()
    }
    const handleTaxonNameFilterUpdate = (event: any) => {
      taxonName.value = event
      handleSearch()
    }
    const handleCollectionNumberFilterUpdate = (event: any) => {
      collectionNumber.value = event
      handleSearch()
    }
    const handleStratigraphyHierarchyFilterUpdate = (event: any) => {
      stratigraphyHierarchy.value = event
      handleSearch()
    }
    const handleFossilGroupFilterUpdate = (event: any) => {
      fossilGroups.value = event
      handleSearch()
    }
    const handleHasImageFilterUpdate = (event: any) => {
      hasImage.value = event
      handleSearch()
    }
    const handleHasCoordinatesFilterUpdate = (event: any) => {
      hasCoordinates.value = event
      handleSearch()
    }
    const handleInstitutionsUpdate = (newInstitutions: any[]) => {
      institutions.value = newInstitutions
      handleSearch()
    }
    const localities = computed({
      get: () => $accessor.search.specimen.filters.byIds.localities.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'localities',
          value: val,
        })
      },
    })
    const references = computed({
      get: () => $accessor.search.specimen.filters.byIds.references.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'references',
          value: val,
        })
      },
    })
    const taxonHierarchy = computed({
      get: () => $accessor.search.specimen.filters.byIds.taxonHierarchy.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'taxonHierarchy',
          value: val,
        })
      },
    })
    const collectionNumber = computed({
      get: () => $accessor.search.specimen.filters.byIds.collectionNumber.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'collectionNumber',
          value: val,
        })
      },
    })
    const taxonName = computed({
      get: () => $accessor.search.specimen.filters.byIds.taxonName.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'taxonName',
          value: val,
        })
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
      },
    })
    const fossilGroups = computed({
      get: () => $accessor.search.specimen.filters.byIds.fossilGroups.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'fossilGroups',
          value: val,
        })
      },
    })
    const hasImage = computed({
      get: () => $accessor.search.specimen.filters.byIds.hasImage.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'hasImage',
          value: val,
        })
      },
    })
    const hasCoordinates = computed({
      get: () => $accessor.search.specimen.filters.byIds.hasCoordinates.value,
      set: (val) => {
        $accessor.search.specimen.setFilterValue({
          key: 'hasCoordinates',
          value: val,
        })
      },
    })
    const institutions = computed({
      get: () => $accessor.search.globalFilters.byIds.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
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
      handleLocalityFilterUpdate,
      handleReferenceFilterUpdate,
      handleTaxonHierarchyFilterUpdate,
      handleStratigraphyHierarchyFilterUpdate,
      handleTaxonNameFilterUpdate,
      handleCollectionNumberFilterUpdate,
      handleHasCoordinatesFilterUpdate,
      handleHasImageFilterUpdate,
      handleFossilGroupFilterUpdate,
      handleReset,
      handleSearch,
      localities,
      references,
      fossilGroups,
      taxonHierarchy,
      stratigraphyHierarchy,
      taxonName,
      collectionNumber,
      hasCoordinates,
      hasImage,
      institutions,
      query,
      isEmpty,
      handleMapUpdate,
      handleInstitutionsUpdate,
    }
  },
})
</script>
