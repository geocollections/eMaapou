<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels accordion flat tile multiple>
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
        <filter-map v-model="map" :items="$accessor.search.image.items" />
        <filter-input-text
          v-model="people"
          :title="$t('filters.people').toString()"
        />
        <filter-input-text
          v-model="tags"
          :title="$t('filters.tags').toString()"
        />
        <filter-input-text
          v-model="number"
          :title="$t('filters.number').toString()"
        />
        <filter-input-text
          v-model="author"
          :title="$t('filters.author').toString()"
        />
        <filter-input-range
          v-model="imageSize"
          :label="$t('filters.imageSize').toString()"
        />
        <filter-input-date
          v-model="date"
          :title="$t('filters.date').toString()"
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
import { useFilter } from '~/composables/useFilter'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import {
  useHydrate,
  useHydrateFilterNew,
  useHydrateStatic,
} from '~/composables/useHydrateFilter'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInputDate from '~/components/filter/input/FilterInputDate.vue'
import {
  useQuerySuggestions,
  useQuerySuggestionsStatic,
} from '~/composables/useQuerySuggestions'
import { useWatchSearchQueryParams } from '~/composables/useWatchSearchQueryParams'
export default defineComponent({
  name: 'SearchFormPhoto',
  components: {
    SearchActions,
    InputSearch,
    FilterInputText,
    FilterMap,
    FilterInstitution,
    FilterInputRange,
    FilterInputDate,
    FilterInputAutocompleteNew,
  },
  props: {
    markers: {
      type: Array,
      default: () => [],
    },
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const emitUpdate = ref(true)
    const handleUpdate = () => {
      if (!emitUpdate.value) return
      emit('update')
    }
    const handleReset = () => {
      emit('reset')
    }

    const filters = computed(() => ({
      ...$accessor.search.image.filters,
      ...$accessor.search.globalFilters,
    }))

    const query = computed({
      get: () => $accessor.search.image.query,
      set: (val) => {
        $accessor.search.image.setQuery(val)
      },
    })

    const locality = useFilter('image', 'locality', handleUpdate)
    const people = useFilter('image', 'people', handleUpdate)
    const tags = useFilter('image', 'tags', handleUpdate)
    const map = useFilter('image', 'map', handleUpdate)
    const country = useFilter('image', 'country', handleUpdate)
    const number = useFilter('image', 'number', handleUpdate)
    const author = useFilter('image', 'author', handleUpdate)
    const imageSize = useFilter('image', 'imageSize', handleUpdate)
    const date = useFilter('image', 'date', handleUpdate)

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
          locality,
          toRef(filters.value, 'locality'),
          'locality',
          hydrateLocality
        ),
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
    const hydrate = useHydrate()
    const hydrateStatic = useHydrateStatic()
    const hydrateLocality = hydrate(
      filters.value.locality,
      query,
      {
        itemResource: 'locality',
        itemFields: ['id', 'locality', 'locality_en'],
        itemSearchField: 'id',
        countResource: 'image',
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
    const hydrateCountry = hydrateStatic(filters.value.country, query, {
      pivot: ['country_id', 'country', 'country_en'],
      countResourceRelatedIdKey: 'country_id',
      countResource: 'image',
      countHierarchical: false,
      filters,
      tagFilterKey: 'country',
    })
    const querySuggestions = useQuerySuggestions()
    const querySuggestionsStatic = useQuerySuggestionsStatic()
    const querySuggestionsLocality = querySuggestions(query, {
      resource: 'image',
      pivot: ['locality_id', 'locality', 'locality_en'],
      pivotOffsetField: 'locality_id',
      countHierarchical: false,
      countResourceRelatedKey: 'locality_id',
      excludeFilterKey: 'locality',
      filters,
    })
    const querySuggestionsCountry = querySuggestionsStatic(query, {
      resource: 'image',
      excludeFilterKey: 'country',
      pivot: ['country_id', 'country', 'country_en'],
      limit: 200,
      filters,
    })
    return {
      querySuggestionsLocality,
      querySuggestionsCountry,
      handleUpdate,
      handleReset,
      query,
      locality,
      date,
      author,
      number,
      people,
      tags,
      map,
      institutions,
      imageSize,
      country,
    }
  },
})
</script>
