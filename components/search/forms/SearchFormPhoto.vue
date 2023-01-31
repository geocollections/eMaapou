<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels accordion flat tile multiple>
        <filter-locality v-model="locality" />
        <filter-input-autocomplete-static
          v-model="country"
          :items="countrySuggestions"
          :title="$t('filters.country').toString()"
          :filter-field="$translate({ et: 'text', en: 'text_en' })"
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
import InputSearch from '~/components/input/InputSearch.vue'
import { useFilter } from '~/composables/useFilter'
import FilterLocality from '~/components/filter/FilterLocality.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import {
  useHydrateFilterLocality,
  useHydrateFilterStatic,
} from '~/composables/useHydrateFilter'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInputDate from '~/components/filter/input/FilterInputDate.vue'
import { useGetSuggestions } from '~/composables/useGetSuggestions'
export default defineComponent({
  name: 'SearchFormPhoto',
  components: {
    SearchActions,
    InputSearch,
    FilterLocality,
    FilterInputText,
    FilterMap,
    FilterInstitution,
    FilterInputAutocompleteStatic,
    FilterInputRange,
    FilterInputDate,
  },
  props: {
    markers: {
      type: Array,
      default: () => [],
    },
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const route = useRoute()
    const emitUpdate = ref(true)
    const hydrateFilters = ref(true)
    const handleUpdate = () => {
      if (!emitUpdate.value) return
      hydrateFilters.value = false
      emit('update')
    }
    const handleReset = () => {
      emit('reset')
    }

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
    const hydrateFilterLocality = useHydrateFilterLocality()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getSuggestions = useGetSuggestions()
    const hydrateFilterStatic = useHydrateFilterStatic()
    const state = reactive({
      countrySuggestions: [] as any[],
    })

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
      const countrySuggestionsPromise = getSuggestions(
        toRef(state, 'countrySuggestions'),
        'image',
        'country_id,country,country_en',
        { et: 'country', en: 'country_en' }
      )
      await Promise.all([
        countrySuggestionsPromise,
        hydrateFilterLocality(locality, 'locality'),
      ])
      hydrateFilterStatic(country, 'country', state.countrySuggestions, Number)
      emitUpdate.value = true
    })
    return {
      ...toRefs(state),
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
