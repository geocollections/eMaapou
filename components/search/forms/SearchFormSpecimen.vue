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
              :items="originalStatusSuggestions"
              :filter-field="$translate({ et: 'country', en: 'country_en' })"
            >
              <template #selection="{ item }">
                <div>
                  {{ $translate({ et: item.country, en: item.country_en }) }}
                </div>
              </template>
              <template #suggestion="{ item }">
                <div>
                  {{ $translate({ et: item.country, en: item.country_en }) }}
                </div>
              </template>
            </filter-input-autocomplete-static>
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
              :filter-field="$translate({ et: 'status', en: 'status_en' })"
            >
              <template #selection="{ item }">
                <div>
                  {{ $translate({ et: item.status, en: item.status_en }) }}
                </div>
              </template>
              <template #suggestion="{ item }">
                <div>
                  {{ $translate({ et: item.status, en: item.status_en }) }}
                </div>
              </template>
            </filter-input-autocomplete-static>
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
    FilterInputRange,
    FilterInputAutocompleteStatic,
    FilterRock,
    FilterCollection,
  },
  setup(_props, { emit }) {
    const { $accessor, i18n, $axios } = useContext()
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
    const hydrateFilterTaxonId = useHydrateFilterTaxonId()
    const hydrateFilterRock = useHydrateFilterRock()
    const hydrateFilterCollection = useHydrateFilterCollection()
    const state = reactive({
      countrySuggestions: [] as any[],
      originalStatusSuggestions: [] as any[],
    })
    useFetch(async () => {
      const countySortField = i18n.locale === 'et' ? 'country' : 'country_en'
      state.countrySuggestions = (
        await $axios.$get(
          `https://api.geoloogia.info/solr/specimen?q=%2A&start=0&rows=0&facet=true&facet.pivot=country_id,country,country_en&facet.limit=200&facet.sort=${countySortField}`
        )
      ).facet_counts.facet_pivot['country_id,country,country_en'].map(
        (country: any) => {
          return {
            id: country.value,
            country: country.pivot[0].value,
            country_en: country.pivot[0].pivot[0].value,
          }
        }
      )
      const originalStatusSortField =
        i18n.locale === 'et' ? 'original_status' : 'original_status'
      state.originalStatusSuggestions = (
        await $axios.$get(
          `https://api.geoloogia.info/solr/specimen?q=%2A&start=0&rows=0&facet=true&facet.pivot=original_status_id,original_status,original_status_en&facet.limit=200&facet.sort=${originalStatusSortField}`
        )
      ).facet_counts.facet_pivot[
        'original_status_id,original_status,original_status_en'
      ].map((status: any) => {
        return {
          id: status.value,
          status: status.pivot[0].value,
          status_en: status.pivot[0].pivot[0].value,
        }
      })
      if (route.value.query.locality) {
        locality.value = (
          await hydrateFilterLocality(
            (route.value.query.locality as string).split(',').map(Number)
          )
        ).data.response.docs
      }
      if (route.value.query.collection) {
        collection.value = (
          await hydrateFilterCollection(
            (route.value.query.collection as string).split(',').map(Number)
          )
        ).data.response.docs
      }
      if (route.value.query.fossilGroup) {
        fossilGroup.value = (
          await hydrateFilterTaxonId(
            (route.value.query.fossilGroup as string).split(',').map(Number)
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
      if (route.value.query.rockHierarchy) {
        rockHierarchy.value = (
          await hydrateFilterRock(
            (route.value.query.rockHierarchy as string)
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
      if (route.value.query.country) {
        const countryIds = (route.value.query.country as string)
          .split(',')
          .map(Number)
        country.value = state.countrySuggestions.filter((country) =>
          countryIds.includes(country.id)
        )
      }
      if (route.value.query.originalStatus) {
        const statusIds = (route.value.query.originalStatus as string)
          .split(',')
          .map(Number)
        originalStatus.value = state.originalStatusSuggestions.filter(
          (status) => statusIds.includes(status.id)
        )
      }
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
