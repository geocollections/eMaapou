<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels accordion flat tile multiple>
        <filter-input-range
          v-model="depth"
          :label="$t('filters.depth').toString()"
          interval-labels="intervals.depth"
          :step="0.01"
        />
        <filter-input-autocomplete-new
          v-model="method"
          :title="$t('filters.method').toString()"
          static
          :query-field="
            $i18n.locale === 'et' ? 'analysis_method' : 'analysis_method_en'
          "
          :query-function="querySuggestionsMethod"
        />
        <filter-input-autocomplete-new
          v-model="lab"
          :title="$t('filters.lab').toString()"
          static
          :query-field="$i18n.locale === 'et' ? 'lab' : 'lab_en'"
          :query-function="querySuggestionsLab"
        />
        <filter-input-autocomplete-new
          v-model="sample"
          :title="$t('filters.sample').toString()"
          query-field="sample_number"
          :query-function="querySuggestionsSample"
        />
        <filter-input-autocomplete-new
          v-model="locality"
          :title="$t('filters.locality').toString()"
          :query-field="$i18n.locale === 'et' ? 'locality' : 'locality_en'"
          :query-function="querySuggestionsLocality"
        />
        <filter-input-autocomplete-new
          v-model="site"
          :title="$t('filters.site').toString()"
          :query-field="$i18n.locale === 'et' ? 'name' : 'name_en'"
          :query-function="querySuggestionsSite"
        />
        <filter-map v-model="map" :items="$accessor.search.analysis.items" />
        <filter-input-text
          v-model="agent"
          :title="$t('filters.agent').toString()"
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
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import {
  useHydrate,
  useHydrateFilterNew,
  useHydrateStatic,
} from '~/composables/useHydrateFilter'
import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
import { useFilter } from '~/composables/useFilter'
import {
  useQuerySuggestions,
  useQuerySuggestionsStatic,
} from '~/composables/useQuerySuggestions'
export default defineComponent({
  name: 'SearchFormAnalysis',
  components: {
    SearchActions,
    InputSearch,
    FilterInputRange,
    FilterMap,
    FilterInstitution,
    FilterInputText,
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
      ...$accessor.search.analysis.filters,
      ...$accessor.search.globalFilters,
    }))

    const query = computed({
      get: () => $accessor.search.analysis.query,
      set: (val) => {
        $accessor.search.analysis.setQuery(val)
      },
    })
    const depth = useFilter('analysis', 'depth', handleUpdate)
    const method = useFilter('analysis', 'method', handleUpdate)
    const lab = useFilter('analysis', 'lab', handleUpdate)
    const agent = useFilter('analysis', 'agent', handleUpdate)

    const locality = useFilter('analysis', 'locality', handleUpdate)
    const site = useFilter('analysis', 'site', handleUpdate)
    const sample = useFilter('analysis', 'sample', handleUpdate)
    const map = useFilter('analysis', 'map', handleUpdate)

    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleUpdate()
      },
    })

    watch(
      () => route.value.query,
      () => fetch()
    )

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false
      const hydrationPromise = Promise.all([
        hydrateFilter(
          sample,
          toRef(filters.value, 'sample'),
          'sample',
          hydrateSample
        ),
        hydrateFilter(
          locality,
          toRef(filters.value, 'locality'),
          'locality',
          hydrateLocality
        ),
        hydrateFilter(
          method,
          toRef(filters.value, 'method'),
          'method',
          hydrateMethod
        ),
        hydrateFilter(lab, toRef(filters.value, 'lab'), 'lab', hydrateLab),
        hydrateFilter(site, toRef(filters.value, 'site'), 'site', hydrateSite),
      ])
      await Promise.all([hydrationPromise])

      emitUpdate.value = true
    })
    const hydrateFilter = useHydrateFilterNew()
    const hydrateStatic = useHydrateStatic()
    const hydrate = useHydrate()
    const hydrateMethod = hydrateStatic(filters.value.method, query, {
      pivot: ['method', 'analysis_method', 'analysis_method_en'],
      countResourceRelatedIdKey: 'method',
      countResource: 'analysis',
      countHierarchical: false,
      filters,
      tagFilterKey: 'method',
    })
    const hydrateLab = hydrateStatic(filters.value.method, query, {
      pivot: ['lab_id', 'lab', 'lab_en'],
      countResourceRelatedIdKey: 'lab_id',
      countResource: 'analysis',
      countHierarchical: false,
      filters,
      tagFilterKey: 'lab',
    })
    const hydrateSample = hydrate(
      filters.value.sample,
      query,
      {
        itemResource: 'sample',
        itemFields: ['id', 'number'],
        itemSearchField: 'id',
        countResource: 'analysis',
        countResourceRelatedIdKey: 'sample_id',
        countHierarchical: false,
        tagFilterKey: 'sample',
        filters,
      },
      (items, counts) =>
        items.map((item: any) => ({
          id: parseInt(item.id),
          text: item.number,
          text_en: item.number,
          count: counts[item.id],
        }))
    )
    const hydrateLocality = hydrate(
      filters.value.locality,
      query,
      {
        itemResource: 'locality',
        itemFields: ['id', 'locality', 'locality_en'],
        itemSearchField: 'id',
        countResource: 'analysis',
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
    const hydrateSite = hydrate(
      filters.value.site,
      query,
      {
        itemResource: 'site',
        itemFields: ['id', 'name', 'name_en'],
        itemSearchField: 'id',
        countResource: 'analysis',
        countResourceRelatedIdKey: 'site_id',
        countHierarchical: false,
        tagFilterKey: 'site',
        filters,
      },
      (items, counts) =>
        items.map((item: any) => ({
          id: parseInt(item.id),
          text: item.name,
          text_en: item.name_en,
          count: counts[item.id],
        }))
    )
    const querySuggestionsStatic = useQuerySuggestionsStatic()
    const querySuggestionsMethod = querySuggestionsStatic(query, {
      resource: 'analysis',
      excludeFilterKey: 'method',
      pivot: ['method', 'analysis_method', 'analysis_method_en'],
      limit: 100,
      filters,
    })
    const querySuggestionsLab = querySuggestionsStatic(query, {
      resource: 'analysis',
      excludeFilterKey: 'lab',
      pivot: ['lab_id', 'lab', 'lab_en'],
      limit: 100,
      filters,
    })
    const querySuggestions = useQuerySuggestions()
    const querySuggestionsSample = querySuggestions(query, {
      resource: 'analysis',
      pivot: ['sample_id', 'sample_number'],
      pivotOffsetField: 'sample_id',
      countResourceRelatedKey: 'sample_id',
      countHierarchical: false,
      excludeFilterKey: 'sample',
      filters,
    })
    const querySuggestionsLocality = querySuggestions(query, {
      resource: 'analysis',
      pivot: ['locality_id', 'locality', 'locality_en'],
      pivotOffsetField: 'locality_id',
      countHierarchical: false,
      countResourceRelatedKey: 'locality_id',
      excludeFilterKey: 'locality',
      filters,
    })
    const querySuggestionsSite = querySuggestions(query, {
      resource: 'analysis',
      pivot: ['site_id', 'name', 'name_en'],
      pivotOffsetField: 'site_id',
      countHierarchical: false,
      countResourceRelatedKey: 'site_id',
      excludeFilterKey: 'site',
      filters,
    })
    return {
      querySuggestionsMethod,
      querySuggestionsLab,
      querySuggestionsSample,
      querySuggestionsLocality,
      querySuggestionsSite,
      handleReset,
      handleUpdate,
      depth,
      query,
      method,
      locality,
      map,
      institutions,
      lab,
      agent,
      sample,
      site,
    }
  },
})
</script>
