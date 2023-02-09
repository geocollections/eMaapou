<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels accordion flat tile multiple>
        <filter-input-text
          v-model="number"
          :title="$t('filters.preparationNumber').toString()"
        />
        <filter-input-autocomplete-new
          v-model="locality"
          :title="$t('filters.locality').toString()"
          :query-field="$i18n.locale === 'et' ? 'locality' : 'locality_en'"
          :query-function="querySuggestionsLocality"
        />
        <filter-map v-model="map" :items="$accessor.search.preparation.items" />
        <filter-input-range
          v-model="depth"
          :label="$t('filters.depth').toString()"
          interval-labels="intervals.depth"
          :step="0.01"
        />
        <filter-input-autocomplete-new
          v-model="stratigraphyHierarchy"
          :title="$t('filters.stratigraphyHierarchy').toString()"
          :query-field="
            $i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en'
          "
          :query-function="querySuggestionsStratigraphy"
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
import { useFilter } from '~/composables/useFilter'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
import { useHydrate, useHydrateFilterNew } from '~/composables/useHydrateFilter'
import { useQuerySuggestions } from '~/composables/useQuerySuggestions'
import { useWatchSearchQueryParams } from '~/composables/useWatchSearchQueryParams'
export default defineComponent({
  name: 'SearchFormPreparation',
  components: {
    SearchActions,
    FilterInputText,
    FilterInputRange,
    FilterMap,
    FilterInputAutocompleteNew,
    InputSearch,
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
    const query = computed({
      get: () => $accessor.search.preparation.query,
      set: (val) => {
        $accessor.search.preparation.setQuery(val)
      },
    })
    const number = useFilter('preparation', 'number', handleUpdate)
    const locality = useFilter('preparation', 'locality', handleUpdate)
    const stratigraphyHierarchy = useFilter(
      'preparation',
      'stratigraphyHierarchy',
      handleUpdate
    )
    const depth = useFilter('preparation', 'depth', handleUpdate)
    const map = useFilter('preparation', 'map', handleUpdate)

    const filters = computed(() => $accessor.search.preparation.filters)
    useWatchSearchQueryParams(() => fetch())

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false
      await Promise.all([
        hydrateFilter(
          stratigraphyHierarchy,
          toRef(filters.value, 'stratigraphyHierarchy'),
          'stratigraphyHierarchy',
          hydrateStratigraphyHierarchy
        ),
        hydrateFilter(
          locality,
          toRef(filters.value, 'locality'),
          'locality',
          hydrateLocality
        ),
      ])
      emitUpdate.value = true
    })
    const hydrateFilter = useHydrateFilterNew()
    const hydrate = useHydrate()
    const hydrateLocality = hydrate(
      filters.value.locality,
      query,
      {
        itemResource: 'locality',
        itemFields: ['id', 'locality', 'locality_en'],
        itemSearchField: 'id',
        countResource: 'preparation',
        countResourceRelatedIdKey: 'locality_id',
        countHierarchical: false,
        tagFilterKey: 'locality',
        filters,
      },
      (items, counts) =>
        items.map((item: any) => ({
          id: parseInt(item.id),
          text: item.locality,
          text_en: item.locality_en,
          count: counts[item.id],
        }))
    )
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
        countResource: 'preparation',
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
    const querySuggestions = useQuerySuggestions()
    const querySuggestionsLocality = querySuggestions(query, {
      resource: 'preparation',
      pivot: ['locality_id', 'locality', 'locality_en'],
      pivotOffsetField: 'locality_id',
      countHierarchical: false,
      countResourceRelatedKey: 'locality_id',
      excludeFilterKey: 'locality',
      filters,
    })
    const querySuggestionsStratigraphy = querySuggestions(
      query,
      {
        resource: 'preparation',
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
    return {
      handleReset,
      querySuggestionsLocality,
      querySuggestionsStratigraphy,
      query,
      number,
      locality,
      stratigraphyHierarchy,
      depth,
      map,
      handleUpdate,
    }
  },
})
</script>
