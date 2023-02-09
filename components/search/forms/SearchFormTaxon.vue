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
        <!-- <filter-input-autocomplete-new -->
        <!--   v-model="stratigraphyHierarchy" -->
        <!--   :title="$t('filters.stratigraphyHierarchy').toString()" -->
        <!--   :query-field=" -->
        <!--     $i18n.locale === 'et' ? 'stratigraphy' : 'startigraphy_en' -->
        <!--   " -->
        <!--   :query-function="querySuggestionsStratigraphy" -->
        <!-- /> -->
        <filter-input-autocomplete-new
          v-model="taxonHierarchy"
          :title="$t('filters.taxonHierarchy').toString()"
          query-field="taxon"
          :query-function="querySuggestionsTaxon"
        />
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
  toRef,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
import { useHydrate, useHydrateFilterNew } from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
import { useQuerySuggestions } from '~/composables/useQuerySuggestions'
import { useWatchSearchQueryParams } from '~/composables/useWatchSearchQueryParams'
export default defineComponent({
  name: 'SearchFormTaxon',
  components: {
    SearchActions,
    InputSearch,
    FilterMap,
    FilterInputText,
    FilterInputAutocompleteNew,
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const emitUpdate = ref(true)
    const handleReset = () => {
      emit('reset')
    }
    const handleUpdate = () => {
      if (!emitUpdate.value) return
      emit('update')
    }

    const filters = computed(() => $accessor.search.taxon.filters)
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

    useWatchSearchQueryParams(()=> fetch())

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false
      await Promise.all([
        hydrateFilter(
          taxonHierarchy,
          toRef(filters.value, 'taxonHierarchy'),
          'taxonHierarchy',
          hydrateTaxonHierarchy
        ),
        // hydrateFilter(
        //   stratigraphyHierarchy,
        //   toRef(filters.value, 'stratigraphyHierarchy'),
        //   'stratigraphyHierarchy',
        //   hydrateStratigraphyHierarchy
        // ),
      ])
      emitUpdate.value = true
    })
    const hydrateFilter = useHydrateFilterNew()
    const hydrate = useHydrate()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hydrateStratigraphyHierarchy = hydrate(
      filters.value.stratigraphyHierarchy,
      query,
      {
        itemResource: 'stratigraphy',
        itemFields: [
          'id',
          'stratigraphy',
          'stratigraphy_en',
          'hierarchy_string',
        ],
        itemSearchField: 'hierarchy_string',
        countResource: 'taxon',
        countResourceRelatedIdKey: 'stratigraphy_hierarchy',
        countHierarchical: true,
        tagFilterKey: 'stratigraphyHierarchy',
        filters,
      },
      (items, counts) =>
        items.map((item: any) => ({
          id: item.hierarchy_string,
          text: item.stratigraphy,
          text_en: item.stratigraphy_en,
          hierarchy_string: item.hierarchy_string,
          count: counts[item.hierarchy_string],
        }))
    )
    const hydrateTaxonHierarchy = hydrate(
      filters.value.taxonHierarchy,
      query,
      {
        itemResource: 'taxon',
        itemFields: ['id', 'taxon', 'hierarchy_string'],
        itemSearchField: 'hierarchy_string',
        countResource: 'taxon',
        countResourceRelatedIdKey: 'hierarchy_string',
        countHierarchical: true,
        tagFilterKey: 'taxonHierarchy',
        filters,
      },
      (items, counts) =>
        items.map((item: any) => ({
          id: item.hierarchy_string,
          text: item.taxon,
          text_en: item.taxon,
          hierarchy_string: item.hierarchy_string,
          count: counts[item.hierarchy_string],
        }))
    )
    const querySuggestions = useQuerySuggestions()
    const querySuggestionsStratigraphy = querySuggestions(
      query,
      {
        resource: 'taxon',
        pivot: ['stratigraphy_hierarchy', 'stratigraphy', 'stratigraphy_en'],
        pivotOffsetField: 'stratigraphy_hierarchy',
        countResourceRelatedKey: 'stratigraphy_hierarchy',
        countHierarchical: true,
        excludeFilterKey: 'stratigraphyHierarchy',
        filters,
      },
      (items, counts) =>
        items.map((item: any) => ({
          id: item.value as number,
          count: counts[item.value] as number,
          text: item.pivot?.[0].value ?? item.value,
          text_en:
            item.pivot?.[0].pivot?.[0].value ??
            item.pivot?.[0].value ??
            item.value,
          hierarchy_string: item.value,
        }))
    )
    const querySuggestionsTaxon = querySuggestions(
      query,
      {
        resource: 'taxon',
        pivot: ['hierarchy_string', 'taxon'],
        pivotOffsetField: 'hierarchy_string',
        countResourceRelatedKey: 'hierarchy_string',
        countHierarchical: true,
        excludeFilterKey: 'taxonHierarchy',
        filters,
      },
      (items, counts) =>
        items.map((item: any) => ({
          id: item.value as number,
          count: counts[item.value] as number,
          text: item.pivot?.[0].value ?? item.value,
          text_en: item.pivot?.[0].value ?? item.value,
          hierarchy_string: item.value,
        }))
    )
    return {
      query,
      querySuggestionsStratigraphy,
      querySuggestionsTaxon,
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
