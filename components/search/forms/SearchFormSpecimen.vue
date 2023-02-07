<template>
  <div>
    <v-form @submit.prevent.stop="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <filter-input-checkbox
        v-model="hasImage"
        :label="$t('filters.hasImage').toString()"
      />
      <filter-input-checkbox
        v-model="hasCoordinates"
        :label="$t('filters.hasCoordinates').toString()"
      />
      <v-expansion-panels class="mt-3" accordion flat tile multiple>
        <filter-input-text
          v-model="number"
          :title="$t('filters.specimenNumber').toString()"
        />
        <filter-input-autocomplete-new
          v-model="collection"
          :title="$t('filters.collection').toString()"
          query-field="collection_number"
          :query-function="querySuggestionsCollection"
        />
        <filter-input-autocomplete-new
          v-model="fossilGroup"
          :title="$t('filters.fossilGroup').toString()"
          query-field="taxon"
          :query-function="querySuggestionsFossilGroup"
        />
        <filter-input-autocomplete-new
          v-model="taxonHierarchy"
          :title="$t('filters.taxonHierarchy').toString()"
          query-field="taxon"
          :query-function="querySuggestionsTaxon"
        />

        <filter-input-text
          v-model="taxonName"
          :title="$t('filters.taxonName').toString()"
        />
        <filter-input-autocomplete-new
          v-model="rockHierarchy"
          :title="$t('filters.rockHierarchySpecimen').toString()"
          :query-field="$i18n.locale === 'et' ? 'rock' : 'rock_en'"
          :query-function="querySuggestionsRock"
        />
        <filter-input-autocomplete-new
          v-model="locality"
          :title="$t('filters.locality').toString()"
          :query-field="$i18n.locale === 'et' ? 'locality' : 'locality_en'"
          :query-function="querySuggestionsLocality"
        />
        <filter-input-autocomplete-new
          v-model="country"
          :title="$t('filters.country').toString()"
          static
          :query-field="$i18n.locale === 'et' ? 'country' : 'country_en'"
          :query-function="querySuggestionsCountry"
        />
        <filter-map
          v-model="map"
          sample-overlay
          :items="$accessor.search.specimen.items"
        />
        <filter-input-autocomplete-new
          v-model="stratigraphyHierarchy"
          :title="$t('filters.stratigraphyHierarchy').toString()"
          :query-field="
            $i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en'
          "
          :query-function="querySuggestionsStratigraphy"
        />
        <filter-input-range
          v-model="depth"
          :label="$t('filters.depth').toString()"
          interval-labels="intervals.depth"
          :step="0.01"
        />
        <filter-reference v-model="reference" />
        <!--  TODO: replace reference filter when specimen index `specimen_references` field uses keyword tokenizer-->
        <!-- <filter-input-autocomplete-new -->
        <!--   v-model="reference" -->
        <!--   :title="$t('filters.reference').toString()" -->
        <!--   :query-function="querySuggestionsReference" -->
        <!-- /> -->
        <filter-input-text
          v-model="collector"
          :title="$t('filters.collector').toString()"
        />
        <filter-input-autocomplete-new
          v-model="originalStatus"
          :title="$t('filters.originalStatus').toString()"
          static
          :query-field="
            $i18n.locale === 'et' ? 'original_status' : 'original_status_en'
          "
          :query-function="querySuggestionsOriginalStatus"
        />
        <filter-institution v-model="institutions" />
      </v-expansion-panels>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  toRef,
  useContext,
  useFetch,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import SearchActions from '../SearchActions.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputCheckbox from '~/components/filter/input/FilterInputCheckbox.vue'
import FilterReference from '~/components/filter/FilterReference.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
import {
  useHydrateFilterReference,
  useHydrate,
  useHydrateStatic,
  useHydrateMulti,
  useHydrateFilterNew,
} from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
import { DefaultFilterObject } from '~/types/filters'
import {
  useQuerySuggestions,
  useQuerySuggestionsMulti,
  useQuerySuggestionsStatic,
} from '~/composables/useQuerySuggestions'

export default defineComponent({
  name: 'SearchFormSpecimen',
  components: {
    FilterInputCheckbox,
    FilterMap,
    SearchActions,
    InputSearch,
    FilterInstitution,
    FilterReference,
    FilterInputText,
    FilterInputRange,
    FilterInputAutocompleteNew,
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
    const filters = computed(() => ({
      ...$accessor.search.specimen.filters,
      ...$accessor.search.globalFilters,
    }))

    const number = useFilter('specimen', 'number', handleUpdate)
    const locality = useFilter('specimen', 'locality', handleUpdate)
    const reference = useFilter('specimen', 'reference', handleUpdate)
    const taxonHierarchy = useFilter('specimen', 'taxonHierarchy', handleUpdate)
    const collection = useFilter('specimen', 'collection', handleUpdate)
    const taxonName = useFilter('specimen', 'taxonName', handleUpdate)
    const stratigraphyHierarchy = useFilter(
      'specimen',
      'stratigraphyHierarchy',
      handleUpdate
    )
    const fossilGroup = useFilter('specimen', 'fossilGroup', handleUpdate)
    const hasImage = useFilter('specimen', 'hasImage', handleUpdate)
    const hasCoordinates = useFilter('specimen', 'hasCoordinates', handleUpdate)
    const map = useFilter('specimen', 'map', handleUpdate)
    const depth = useFilter('specimen', 'depth', handleUpdate)
    const country = useFilter('specimen', 'country', handleUpdate)
    const rockHierarchy = useFilter('specimen', 'rockHierarchy', handleUpdate)
    const originalStatus = useFilter('specimen', 'originalStatus', handleUpdate)
    const collector = useFilter('specimen', 'collector', handleUpdate)
    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleUpdate()
      },
    })
    const query = computed({
      get: () => $accessor.search.specimen.query,
      set: (val) => {
        $accessor.search.specimen.setQuery(val)
      },
    })

    const hydrateFilterReference = useHydrateFilterReference()
    const hydrateFilter = useHydrateFilterNew()
    const hydrate = useHydrate()
    const hydrateStatic = useHydrateStatic()
    const hydrateMulti = useHydrateMulti()

    const querySuggestions = useQuerySuggestions()
    const querySuggestionsStatic = useQuerySuggestionsStatic()
    const querySuggestionsMulti = useQuerySuggestionsMulti()

    watch(
      () => route.value.query,
      () => fetch()
    )

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false
      await Promise.all([
        hydrateFilter(
          locality,
          toRef(filters.value, 'locality'),
          'locality',
          hydrateLocality
        ),
        hydrateFilter(
          collection,
          toRef(filters.value, 'collection'),
          'collection',
          hydrateCollection
        ),
        hydrateFilter(
          fossilGroup,
          toRef(filters.value, 'fossilGroup'),
          'fossilGroup',
          hydrateFossilGroup
        ),
        hydrateFilterReference(reference, 'reference'),
        hydrateFilter(
          taxonHierarchy,
          toRef(filters.value, 'taxonHierarchy'),
          'taxonHierarchy',
          hydrateTaxonHierarchy
        ),
        hydrateFilter(
          rockHierarchy,
          toRef(filters.value, 'rockHierarchy'),
          'rockHierarchy',
          hydrateRockHierarchy
        ),
        hydrateFilter(
          stratigraphyHierarchy,
          toRef(filters.value, 'stratigraphyHierarchy'),
          'stratigraphyHierarchy',
          hydrateStratigraphyHierarchy
        ),
        hydrateFilter(
          country,
          toRef(filters.value, 'country'),
          'country',
          hydrateCountry
        ),
        hydrateFilter(
          originalStatus,
          toRef(filters.value, 'originalStatus'),
          'originalStatus',
          hydrateOriginalStatus
        ),
      ])
      emitUpdate.value = true
    })

    const hydrateCountry = hydrateStatic({
      pivot: ['country_id', 'country', 'country_en'],
      countResourceRelatedIdKey: 'country_id',
      countResource: 'specimen',
      countHierarchical: false,
      filters,
      tagFilterKey: 'country',
    })
    const hydrateOriginalStatus = hydrateStatic({
      pivot: ['original_status_id', 'original_status', 'original_status_en'],
      countResourceRelatedIdKey: 'original_status_id',
      countResource: 'specimen',
      countHierarchical: false,
      filters,
      tagFilterKey: 'originalStatus',
    })
    const hydrateLocality = hydrate(
      {
        itemResource: 'locality',
        itemFields: ['id', 'locality', 'locality_en'],
        itemSearchField: 'id',
        countResource: 'specimen',
        countResourceRelatedIdKey: 'locality_id',
        countHierarchical: false,
        tagFilterKey: 'locality',
        filters,
      },
      (items, counts) => {
        return items.map((item: any): DefaultFilterObject => {
          return {
            id: parseInt(item.id),
            text: item.locality,
            text_en: item.locality_en,
            count: counts[item.id],
          }
        })
      }
    )
    const hydrateCollection = hydrate(
      {
        itemResource: 'collection',
        itemFields: ['id', 'number'],
        itemSearchField: 'id',
        countResource: 'specimen',
        countResourceRelatedIdKey: 'collection_id',
        countHierarchical: false,
        tagFilterKey: 'collection',
        filters,
      },
      (items, counts) => {
        return items.map((item: any): DefaultFilterObject => {
          return {
            id: parseInt(item.id),
            text: item.number,
            text_en: item.number,
            count: counts[item.id],
          }
        })
      }
    )
    const hydrateFossilGroup = hydrate(
      {
        itemResource: 'taxon',
        itemFields: ['id', 'taxon'],
        itemSearchField: 'id',
        countResource: 'specimen',
        countResourceRelatedIdKey: 'fossilgroup_id',
        countHierarchical: false,
        tagFilterKey: 'fossilGroup',
        filters,
      },
      (items, counts) => {
        return items.map((item: any): DefaultFilterObject => {
          return {
            id: parseInt(item.id),
            text: item.taxon,
            text_en: item.taxon,
            count: counts[item.id],
          }
        })
      }
    )

    const hydrateTaxonHierarchy = hydrate(
      {
        itemResource: 'taxon',
        itemFields: ['id', 'taxon', 'hierarchy_string'],
        itemSearchField: 'hierarchy_string',
        countResource: 'specimen',
        countResourceRelatedIdKey: 'hierarchy_string',
        countHierarchical: true,
        tagFilterKey: 'taxonHierarchy',
        filters,
      },
      (items, counts) => {
        return items.map((item: any) => {
          return {
            id: item.hierarchy_string,
            text: item.taxon,
            text_en: item.taxon,
            hierarchy_string: item.hierarchy_string,
            count: counts[item.hierarchy_string],
          }
        })
      }
    )
    const hydrateStratigraphyHierarchy = hydrate(
      {
        itemResource: 'stratigraphy',
        itemFields: [
          'id',
          'stratigraphy',
          'stratigraphy_en',
          'hierarchy_string',
        ],
        itemSearchField: 'hierarchy_string',
        countResource: 'specimen',
        countResourceRelatedIdKey: 'stratigraphy_hierarchy',
        countHierarchical: true,
        tagFilterKey: 'stratigraphyHierarchy',
        filters,
      },
      (items, counts) => {
        return items.map((item: any) => {
          return {
            id: item.hierarchy_string,
            text: item.stratigraphy,
            text_en: item.stratigraphy_en,
            hierarchy_string: item.hierarchy_string,
            count: counts[item.hierarchy_string],
          }
        })
      }
    )
    const hydrateRockHierarchy = hydrateMulti(
      filters.value.rockHierarchy,
      {
        itemResource: 'rock',
        itemFields: ['id', 'name', 'name_en', 'hierarchy_strings'],
        itemSearchField: 'hierarchy_strings',
        countResource: 'specimen',
        countResourceRelatedIdKey: 'hierarchy_string_rock',
        countHierarchical: true,
        tagFilterKey: 'rockHierarchy',
        queryFilters: filters,
      },
      (items, counts) => {
        return items.map((item: any) => {
          return {
            id: item.id,
            text: item.name,
            text_en: item.name_en,
            hierarchy_strings: item.hierarchy_strings,
            count: counts[item.id],
          }
        })
      }
    )
    const querySuggestionsLocality = querySuggestions({
      resource: 'specimen',
      pivot: ['locality_id', 'locality', 'locality_en'],
      pivotOffsetField: 'locality_id',
      countHierarchical: false,
      countResourceRelatedKey: 'locality_id',
      excludeFilterKey: 'locality',
      filters,
    })
    const querySuggestionsCollection = querySuggestions({
      resource: 'specimen',
      pivot: ['collection_id', 'collection_number'],
      pivotOffsetField: 'collection_id',
      countResourceRelatedKey: 'collection_id',
      countHierarchical: false,
      excludeFilterKey: 'collection',
      filters,
    })
    const querySuggestionsFossilGroup = querySuggestions({
      resource: 'specimen',
      pivot: ['fossilgroup_id', 'fossilgroup'],
      pivotOffsetField: 'fossilgroup_id',
      countResourceRelatedKey: 'fossilgroup_id',
      countHierarchical: false,
      excludeFilterKey: 'fossilGroup',
      filters,
    })

    // TODO: `specimen_references` should be a strings field with keyword tokenizer in solr.
    const querySuggestionsReference = querySuggestions({
      resource: 'specimen',
      pivot: ['specimen_references'],
      pivotOffsetField: 'specimen_references',
      countResourceRelatedKey: 'specimen_references',
      countHierarchical: false,
      excludeFilterKey: 'reference',
      filters,
    })

    const querySuggestionsCountry = querySuggestionsStatic({
      resource: 'specimen',
      excludeFilterKey: 'country',
      pivot: ['country_id', 'country', 'country_en'],
      limit: 200,
      filters,
    })

    const querySuggestionsOriginalStatus = querySuggestionsStatic({
      resource: 'specimen',
      excludeFilterKey: 'originalStatus',
      pivot: ['original_status_id', 'original_status', 'original_status_en'],
      limit: 100,
      filters,
    })

    const querySuggestionsTaxon = querySuggestions(
      {
        resource: 'specimen',
        pivot: ['hierarchy_string', 'taxon,taxon_id'],
        pivotOffsetField: 'hierarchy_string',
        countResourceRelatedKey: 'hierarchy_string',
        countHierarchical: true,
        excludeFilterKey: 'taxonHierarchy',
        filters,
      },
      (items, counts) => {
        return items.map((item: any) => {
          return {
            id: item.value as number,
            count: counts[item.value] as number,
            text: item.pivot?.[0].value ?? item.value,
            text_en: item.pivot?.[0].value ?? item.value,
            hierarchy_string: item.value,
          }
        })
      }
    )
    const querySuggestionsRock = querySuggestionsMulti(
      {
        resource: 'specimen',
        pivot: ['rock_id'],
        pivotOffsetField: 'rock_id',
        countResourceRelatedKey: 'hierarchy_string_rock',
        countHierarchical: true,
        excludeFilterKey: 'rockHierarchy',
        filters,
      },
      (items, counts) => {
        return items.map((item: any) => {
          return {
            id: item.id as number,
            count: counts[item.id] as number,
            text: item.name,
            text_en: item.name_en,
            hierarchy_strings: item.hierarchy_strings,
          }
        })
      }
    )
    const querySuggestionsStratigraphy = querySuggestions(
      {
        resource: 'specimen',
        pivot: ['stratigraphy_hierarchy', 'stratigraphy', 'stratigraphy_en'],
        pivotOffsetField: 'stratigraphy_hierarchy',
        countResourceRelatedKey: 'stratigraphy_hierarchy',
        countHierarchical: true,
        excludeFilterKey: 'stratigraphyHierarchy',
        filters,
      },
      (items, counts) => {
        return items.map((item: any) => {
          return {
            id: item.value as number,
            count: counts[item.value] as number,
            text: item.pivot?.[0].value ?? item.value,
            text_en:
              item.pivot?.[0].pivot?.[0].value ??
              item.pivot?.[0].value ??
              item.value,
            hierarchy_string: item.value,
          }
        })
      }
    )
    return {
      handleReset,
      querySuggestionsLocality,
      querySuggestionsCollection,
      querySuggestionsTaxon,
      querySuggestionsFossilGroup,
      querySuggestionsStratigraphy,
      querySuggestionsReference,
      querySuggestionsCountry,
      querySuggestionsOriginalStatus,
      querySuggestionsRock,
      handleUpdate,
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
