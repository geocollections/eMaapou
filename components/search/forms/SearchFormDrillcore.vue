<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels accordion flat tile multiple>
        <filter-input-text
          v-model="name"
          :title="$t('filters.drillcoreName').toString()"
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
          borehole-overlay
          :items="$accessor.search.drillcore.items"
        />
        <filter-input-autocomplete-new
          v-model="repository"
          :title="$t('filters.drillcoreRepository').toString()"
          static
          :query-field="
            $i18n.locale === 'et' ? 'core_repository' : 'core_repository_en'
          "
          :query-function="querySuggestionsRepository"
        />
        <filter-input-range
          v-model="boxes"
          :label="$t('filters.drillcoreBoxes').toString()"
        />
        <filter-input-text
          v-model="stratigraphyAge"
          :title="$t('filters.stratigraphyAge').toString()"
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
} from '@nuxtjs/composition-api'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
import { useFilter } from '~/composables/useFilter'
import {
  useHydrateFilterNew,
  useHydrateStatic,
} from '~/composables/useHydrateFilter'
import { useQuerySuggestionsStatic } from '~/composables/useQuerySuggestions'
import { useWatchSearchQueryParams } from '~/composables/useWatchSearchQueryParams'
export default defineComponent({
  name: 'SearchFormDrillcore',
  components: {
    SearchActions,
    InputSearch,
    FilterInputRange,
    FilterInstitution,
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

    const filters = computed(() => ({
      ...$accessor.search.drillcore.filters,
      ...$accessor.search.globalFilters,
    }))
    const query = computed({
      get: () => $accessor.search.drillcore.query,
      set: (val) => {
        $accessor.search.drillcore.setQuery(val)
      },
    })
    const name = useFilter('drillcore', 'name', handleUpdate)
    const boxes = useFilter('drillcore', 'boxes', handleUpdate)
    const country = useFilter('drillcore', 'country', handleUpdate)
    const repository = useFilter('drillcore', 'repository', handleUpdate)
    const map = useFilter('drillcore', 'map', handleUpdate)
    const stratigraphyAge = useFilter(
      'drillcore',
      'stratigraphyAge',
      handleUpdate
    )
    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleUpdate()
      },
    })

    useWatchSearchQueryParams(() => fetch())

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false
      await Promise.all([
        hydrateFilter(
          country,
          toRef(filters.value, 'country'),
          'country',
          hydrateCountry
        ),
        hydrateFilter(
          repository,
          toRef(filters.value, 'repository'),
          'repository',
          hydrateRepository
        ),
      ])
      emitUpdate.value = true
    })
    const hydrateFilter = useHydrateFilterNew()
    const hydrateStatic = useHydrateStatic()
    const hydrateCountry = hydrateStatic(filters.value.country, query, {
      pivot: ['country_id', 'country', 'country_en'],
      countResourceRelatedIdKey: 'country_id',
      countResource: 'drillcore',
      countHierarchical: false,
      filters,
      tagFilterKey: 'country',
    })
    const hydrateRepository = hydrateStatic(filters.value.repository, query, {
      pivot: ['core_repository_id', 'core_repository', 'core_repository_en'],
      countResourceRelatedIdKey: 'core_repository_id',
      countResource: 'drillcore',
      countHierarchical: false,
      filters,
      tagFilterKey: 'repository',
    })
    const querySuggestionsStatic = useQuerySuggestionsStatic()
    const querySuggestionsCountry = querySuggestionsStatic(query, {
      resource: 'drillcore',
      excludeFilterKey: 'country',
      pivot: ['country_id', 'country', 'country_en'],
      limit: 200,
      filters,
    })
    const querySuggestionsRepository = querySuggestionsStatic(query, {
      resource: 'drillcore',
      excludeFilterKey: 'repository',
      pivot: ['core_repository_id', 'core_repository', 'core_repository_en'],
      limit: 200,
      filters,
    })
    return {
      query,
      querySuggestionsCountry,
      querySuggestionsRepository,
      country,
      repository,
      boxes,
      map,
      institutions,
      name,
      stratigraphyAge,
      handleReset,
      handleUpdate,
    }
  },
})
</script>
