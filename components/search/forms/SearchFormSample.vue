<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
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
          :title="$t('filters.sampleNumber').toString()"
        />
        <filter-input-autocomplete-new
          v-model="locality"
          :title="$t('filters.locality').toString()"
          :query-field="$i18n.locale === 'et' ? 'locality' : 'locality_en'"
          :query-function="querySuggestionsLocality"
        />
        <filter-map
          v-model="map"
          sample-overlay
          :items="$accessor.search.sample.items"
        />
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
        <filter-input-autocomplete-new
          v-model="rockHierarchy"
          :title="$t('filters.rockHierarchySpecimen').toString()"
          :query-field="$i18n.locale === 'et' ? 'rock' : 'rock_en'"
          :query-function="querySuggestionsRock"
        />
        <filter-input-text
          v-model="collector"
          :title="$t('filters.collector').toString()"
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
  useContext,
  useFetch,
  useRoute,
  watch,
  toRef,
} from '@nuxtjs/composition-api'
import SearchActions from '../SearchActions.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputCheckbox from '~/components/filter/input/FilterInputCheckbox.vue'
import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
import {
  useHydrate,
  useHydrateFilterNew,
  useHydrateMulti,
} from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
import {
  useQuerySuggestions,
  useQuerySuggestionsMulti,
} from '~/composables/useQuerySuggestions'
export default defineComponent({
  name: 'SearchFormSample',
  components: {
    FilterInstitution,
    FilterInputRange,
    FilterInputText,
    SearchActions,
    FilterMap,
    InputSearch,
    FilterInputCheckbox,
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
      ...$accessor.search.sample.filters,
      ...$accessor.search.globalFilters,
    }))
    const locality = useFilter('sample', 'locality', handleUpdate)
    const stratigraphyHierarchy = useFilter(
      'sample',
      'stratigraphyHierarchy',
      handleUpdate
    )
    const number = useFilter('sample', 'number', handleUpdate)
    const collector = useFilter('sample', 'collector', handleUpdate)
    const depth = useFilter('sample', 'depth', handleUpdate)
    const map = useFilter('sample', 'map', handleUpdate)
    const hasImage = useFilter('sample', 'hasImage', handleUpdate)
    const hasCoordinates = useFilter('sample', 'hasCoordinates', handleUpdate)
    const rockHierarchy = useFilter('sample', 'rockHierarchy', handleUpdate)
    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleUpdate()
      },
    })
    const query = computed({
      get: () => $accessor.search.sample.query,
      set: (val) => {
        $accessor.search.sample.setQuery(val)
      },
    })

    watch(
      () => route.value.query,
      () => fetch()
    )

    const hydrateFilter = useHydrateFilterNew()
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
          stratigraphyHierarchy,
          toRef(filters.value, 'stratigraphyHierarchy'),
          'stratigraphyHierarchy',
          hydrateStratigraphyHierarchy
        ),
        hydrateFilter(
          rockHierarchy,
          toRef(filters.value, 'rockHierarchy'),
          'rockHierarchy',
          hydrateRockHierarchy
        ),
      ])
      emitUpdate.value = true
    })

    const hydrate = useHydrate()
    const hydrateLocality = hydrate(
      filters.value.locality,
      query,
      {
        itemResource: 'locality',
        itemFields: ['id', 'locality', 'locality_en'],
        itemSearchField: 'id',
        countResource: 'sample',
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
        countResource: 'sample',
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
    const hydrateMulti = useHydrateMulti()
    const hydrateRockHierarchy = hydrateMulti(
      filters.value.rockHierarchy,
      query,
      {
        itemResource: 'rock',
        itemFields: ['id', 'name', 'name_en', 'hierarchy_strings'],
        itemSearchField: 'hierarchy_strings',
        countResource: 'sample',
        countResourceRelatedIdKey: 'hierarchy_string_rock',
        countHierarchical: true,
        tagFilterKey: 'rockHierarchy',
        queryFilters: filters,
      },
      (items, counts) =>
        items.map((item: any) => ({
          id: item.id,
          text: item.name,
          text_en: item.name_en,
          hierarchy_strings: item.hierarchy_strings,
          count: counts[item.id],
        }))
    )
    const querySuggestions = useQuerySuggestions()
    const querySuggestionsLocality = querySuggestions(query, {
      resource: 'sample',
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
        resource: 'sample',
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
    const querySuggestionsMulti = useQuerySuggestionsMulti()
    const querySuggestionsRock = querySuggestionsMulti(
      query,
      {
        resource: 'sample',
        pivot: ['rock_id'],
        pivotOffsetField: 'rock_id',
        countResourceRelatedKey: 'hierarchy_string_rock',
        countHierarchical: true,
        excludeFilterKey: 'rockHierarchy',
        filters,
      },
      (items, counts) =>
        items.map((item: any) => ({
          id: item.id as number,
          count: counts[item.id] as number,
          text: item.name,
          text_en: item.name_en,
          hierarchy_strings: item.hierarchy_strings,
        }))
    )
    return {
      querySuggestionsLocality,
      querySuggestionsStratigraphy,
      querySuggestionsRock,
      locality,
      stratigraphyHierarchy,
      number,
      depth,
      collector,
      institutions,
      query,
      map,
      hasImage,
      hasCoordinates,
      rockHierarchy,
      handleReset,
      handleUpdate,
    }
  },
})
</script>
