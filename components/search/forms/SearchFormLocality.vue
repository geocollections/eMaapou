<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels accordion flat tile multiple>
        <filter-input-text
          v-model="name"
          :title="$t('filters.localityName').toString()"
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
          locality-overlay
          :items="$accessor.search.locality.items"
        />
        <filter-input-text
          v-model="stratigraphyAge"
          :title="$t('filters.stratigraphyAge').toString()"
        />
        <filter-reference v-model="reference" />
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
import FilterReference from '~/components/filter/FilterReference.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
import {
  useHydrateFilterNew,
  useHydrateFilterReference,
  useHydrateStatic,
} from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
import { useQuerySuggestionsStatic } from '~/composables/useQuerySuggestions'
import { useWatchSearchQueryParams } from '~/composables/useWatchSearchQueryParams'
export default defineComponent({
  name: 'SearchFormLocality',
  components: {
    SearchActions,
    FilterMap,
    InputSearch,
    FilterReference,
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

    const filters = computed(() => $accessor.search.locality.filters)
    const query = computed({
      get: () => $accessor.search.locality.query,
      set: (val) => {
        $accessor.search.locality.setQuery(val)
      },
    })

    const name = useFilter('locality', 'name', handleUpdate)
    const country = useFilter('locality', 'country', handleUpdate)
    const reference = useFilter('locality', 'reference', handleUpdate)
    const map = useFilter('locality', 'map', handleUpdate)
    const stratigraphyAge = useFilter(
      'locality',
      'stratigraphyAge',
      handleUpdate
    )
    const hydrateFilterReference = useHydrateFilterReference()

    useWatchSearchQueryParams(() => fetch())

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false

      await Promise.all([
        hydrateFilterReference(reference, 'reference'),
        hydrateFilter(
          country,
          toRef(filters.value, 'country'),
          'country',
          hydrateCountry
        ),
      ])
      emitUpdate.value = true
    })
    const hydrateFilter = useHydrateFilterNew()
    const hydrateStatic = useHydrateStatic()
    const hydrateCountry = hydrateStatic(filters.value.country, query, {
      pivot: ['country_id', 'country', 'country_en'],
      countResourceRelatedIdKey: 'country_id',
      countResource: 'locality',
      countHierarchical: false,
      filters,
      tagFilterKey: 'country',
    })
    const querySuggestionsStatic = useQuerySuggestionsStatic()
    const querySuggestionsCountry = querySuggestionsStatic(query, {
      resource: 'locality',
      excludeFilterKey: 'country',
      pivot: ['country_id', 'country', 'country_en'],
      limit: 200,
      filters,
    })
    return {
      querySuggestionsCountry,
      name,
      query,
      reference,
      country,
      map,
      stratigraphyAge,
      handleReset,
      handleUpdate,
    }
  },
})
</script>
