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
        <!-- <filter-taxon v-model="taxonHierarchy" /> -->
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
        <filter-rock
          v-model="rockHierarchy"
          :title="$t('filters.rockHierarchySpecimen').toString()"
        />
        <filter-input-autocomplete-new
          v-model="locality"
          :title="$t('filters.locality').toString()"
          :query-field="$i18n.locale === 'et' ? 'locality' : 'locality_en'"
          :query-function="querySuggestionsLocality"
        />
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
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  reactive,
  ref,
  toRef,
  toRefs,
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
// import FilterTaxon from '~/components/filter/FilterTaxon.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import FilterRock from '~/components/filter/FilterRock.vue'
import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
import {
  useHydrateFilterReference,
  useHydrateFilterRock,
  useHydrateFilterStatic,
  useHydrateFilter,
} from '~/composables/useHydrateFilter'
import { useGetSuggestions } from '~/composables/useGetSuggestions'
import { useFilter } from '~/composables/useFilter'
import { Filter } from '~/types/filters'

type DefaultFilterObject = {
  id: number | string
  text: string
  text_en: string
  count: number
}

export default defineComponent({
  name: 'SearchFormSpecimen',
  components: {
    FilterInputCheckbox,
    FilterMap,
    SearchActions,
    InputSearch,
    FilterInstitution,
    FilterReference,
    // FilterTaxon,
    FilterInputText,
    FilterInputRange,
    FilterInputAutocompleteStatic,
    FilterInputAutocompleteNew,
    FilterRock,
  },
  setup(_props, { emit }) {
    const { $accessor, $services } = useContext()
    const route = useRoute()
    const emitUpdate = ref(true)
    const hydrateFilters = ref(true)
    const handleReset = () => {
      emit('reset')
    }
    const handleUpdate = () => {
      if (!emitUpdate.value) return
      // hydrateFilters.value = false
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
    const hydrateFilterRock = useHydrateFilterRock()
    const hydrateFilterStatic = useHydrateFilterStatic()
    const hydrateFilter = useHydrateFilter()
    const state = reactive({
      countrySuggestions: [] as any[],
      originalStatusSuggestions: [] as any[],
    })
    const getSuggestions = useGetSuggestions()

    watch(
      () => route.value.query,
      () => {
        if (!hydrateFilters.value) {
          hydrateFilters.value = true
          return
        }
        fetch()
      }
    )

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false
      const suggestionPromise = Promise.all([
        getSuggestions(
          toRef(state, 'countrySuggestions'),
          'specimen',
          'country_id,country,country_en',
          {
            et: 'country',
            en: 'country_en',
          }
        ),
        getSuggestions(
          toRef(state, 'originalStatusSuggestions'),
          'specimen',
          'original_status_id,original_status,original_status_en',
          { et: 'original_status', en: 'original_status_en' }
        ),
      ])

      const hydrationPromise = Promise.all([
        hydrateFilter(locality, 'locality', hydrateLocality),
        // hydrateFilterLocality(locality, 'locality'),
        hydrateFilter(collection, 'collection', hydrateCollection),
        hydrateFilter(fossilGroup, 'fossilGroup', hydrateFossilGroup),
        hydrateFilterReference(reference, 'reference'),
        hydrateFilter(taxonHierarchy, 'taxonHierarchy', hydrateTaxonHierarchy),
        hydrateFilterRock(rockHierarchy, 'rockHierarchy'),
        hydrateFilter(
          stratigraphyHierarchy,
          'stratigraphyHierarchy',
          hydrateStratigraphyHierarchy
        ),
      ])
      await Promise.all([suggestionPromise, hydrationPromise])

      // state.countrySuggestions = suggestionResults[0]
      // state.originalStatusSuggestions = suggestionResults[1]

      hydrateFilterStatic(country, 'country', state.countrySuggestions, Number)
      hydrateFilterStatic(
        originalStatus,
        'originalStatus',
        state.originalStatusSuggestions,
        Number
      )
      emitUpdate.value = true
    })
    const hydrate = <
      FilterObject extends {
        id: number | string
        count: number
        [K: string]: any
      } = DefaultFilterObject
    >(
      config: {
        itemResource: string
        itemFields: string[]
        itemSearchField: string
        countResource: string
        countResourceRelatedIdKey: string
        tagFilterKey: string
        countHierarchical: boolean
        filters?: ComputedRef<{ [K: string]: Filter }>
      },
      parseFunc: (
        items: any[],
        counts: { [K: string]: number }
      ) => FilterObject[]
    ) => {
      return async (ids: any[]): Promise<FilterObject[]> => {
        const parsedIds = ids.map((id) => `"${id}"`).join(' OR ')
        const facetQueries = ids.reduce((prev, id) => {
          return {
            ...prev,
            [`{!ex=dt}${config.countResourceRelatedIdKey}:${id}${
              config.countHierarchical ? '*' : ''
            }`]: id,
          }
        }, {})
        const [items, countQueries] = await Promise.all([
          $services.sarvSolr.getResourceList(config.itemResource, {
            search: `${config.itemSearchField}:(${parsedIds})`,
            defaultParams: {
              rows: ids.length,
              fl: config.itemFields.join(','),
            },
            returnRawQ: true,
          }),
          $services.sarvSolr.getResourceList(config.countResource, {
            searchFilters: config.filters?.value,
            tags: {
              [config.tagFilterKey]: 'dt',
            },
            defaultParams: {
              'facet.query': Object.keys(facetQueries),
              rows: 0,
              start: 0,
              facet: true,
              'facet.pivot': `{!ex=dt}${config.countResourceRelatedIdKey}`,
              'facet.limit': ids.length,
            },
            returnRawQ: true,
          }),
        ])
        const counts = Object.keys(countQueries.facet.facet_queries).reduce(
          (prev, curr) => {
            return {
              ...prev,
              [facetQueries[curr]]: countQueries.facet.facet_queries[curr],
            }
          },
          {}
        )
        return parseFunc(items.items, counts)
      }
    }
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
    const querySuggestions = <
      FilterObject extends {
        id: number | string
        count: number
        [K: string]: any
      } = DefaultFilterObject
    >(
      config: {
        module: string
        pivot: string
        pivotOffsetField: string
        countResourceRelatedIdKey: string
        countHierarchical: boolean
        excludeFilterKey: string
        filters?: ComputedRef<{ [key: string]: Filter }>
      },
      parseFunc: (
        items: any,
        counts: { [K: string]: number }
      ) => FilterObject[] = (items, counts) => {
        return items.map((item: any) => {
          return {
            id: item.value as number,
            count: counts[item.value] as number,
            text: item.pivot?.[0].value ?? item.value,
            text_en:
              item.pivot?.[0].pivot?.[0].value ??
              item.pivot?.[0].value ??
              item.value,
          } as unknown as FilterObject
        })
      }
    ) => {
      return async (
        search: string,
        options = { rows: 10, start: 0 }
      ): Promise<FilterObject[]> => {
        let items = (
          await $services.sarvSolr.getResourceList(config.module, {
            search,
            searchFilters: config.filters?.value,
            tags: {
              [config.excludeFilterKey]: 'dt',
            },
            defaultParams: {
              rows: 0,
              start: 0,
              facet: true,
              'facet.pivot': `{!ex=dt}${config.pivot}`,
              [`f.${config.pivotOffsetField}.facet.offset`]: options.start,
              'facet.limit': options.rows,
            },
          })
        ).facet.facet_pivot[config.pivot]
        const facetQueries = items
          .map((item: any) => item.value)
          .reduce((prev: { [K: string]: any }, id: any) => {
            return {
              ...prev,
              [`{!ex=dt}${config.countResourceRelatedIdKey}:${id}${
                config.countHierarchical ? '*' : ''
              }`]: id,
            }
          }, {})

        const facetQueriesResponse = await $services.sarvSolr.getResourceList(
          config.module,
          {
            searchFilters: config.filters?.value,
            tags: {
              [config.excludeFilterKey]: 'dt',
            },
            defaultParams: {
              'facet.query': Object.keys(facetQueries),
              rows: 0,
              start: 0,
              facet: true,
            },
          }
        )

        const counts = Object.keys(
          facetQueriesResponse.facet.facet_queries
        ).reduce((prev: { [K: string]: any }, curr): { [K: string]: any } => {
          return {
            ...prev,
            [facetQueries[curr]]:
              facetQueriesResponse.facet.facet_queries[curr],
          }
        }, {})
        items = items.map((item: any) => ({
          ...item,
          count: counts[item[config.countResourceRelatedIdKey]],
        }))

        return parseFunc(items, counts)
      }
    }
    const querySuggestionsLocality = querySuggestions({
      module: 'specimen',
      pivot: 'locality_id,locality,locality_en',
      pivotOffsetField: 'locality_id',
      countHierarchical: false,
      countResourceRelatedIdKey: 'locality_id',
      excludeFilterKey: 'locality',
      filters,
    })
    const querySuggestionsCollection = querySuggestions({
      module: 'specimen',
      pivot: 'collection_id,collection_number',
      pivotOffsetField: 'collection_id',
      countResourceRelatedIdKey: 'collection_id',
      countHierarchical: false,
      excludeFilterKey: 'collection',
      filters,
    })
    const querySuggestionsFossilGroup = querySuggestions({
      module: 'specimen',
      pivot: 'fossilgroup_id,fossilgroup',
      pivotOffsetField: 'fossilgroup_id',
      countResourceRelatedIdKey: 'fossilgroup_id',
      countHierarchical: false,
      excludeFilterKey: 'fossilGroup',
      filters,
    })
    const querySuggestionsTaxon = querySuggestions(
      {
        module: 'specimen',
        pivot: 'hierarchy_string,taxon,taxon_id',
        pivotOffsetField: 'hierarchy_string',
        countResourceRelatedIdKey: 'hierarchy_string',
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
    const querySuggestionsStratigraphy = querySuggestions(
      {
        module: 'specimen',
        pivot: 'stratigraphy_hierarchy,stratigraphy,stratigraphy_en',
        pivotOffsetField: 'stratigraphy_hierarchy',
        countResourceRelatedIdKey: 'stratigraphy_hierarchy',
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
      ...toRefs(state),
      handleReset,
      querySuggestionsLocality,
      querySuggestionsCollection,
      querySuggestionsTaxon,
      querySuggestionsFossilGroup,
      querySuggestionsStratigraphy,
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
