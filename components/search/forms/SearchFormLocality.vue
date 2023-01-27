<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <search-fields-wrapper>
        <v-card class="mt-3" flat tile color="transparent">
          <v-expansion-panels accordion flat tile multiple>
            <filter-input-text
              v-model="name"
              :title="$t('filters.localityName').toString()"
            />
            <filter-input-autocomplete-static
              v-model="country"
              :title="$t('filters.country').toString()"
              :items="countrySuggestions"
              :filter-field="$translate({ et: 'text', en: 'text_en' })"
            />
            <filter-map
              v-model="map"
              locality-overlay
              :items="$accessor.search.locality.items"
            />
            <filter-reference v-model="reference" />
          </v-expansion-panels>
        </v-card>
      </search-fields-wrapper>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterReference from '~/components/filter/FilterReference.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import {
  useHydrateFilterReference,
  useHydrateFilterStatic,
} from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
import { useGetSuggestions } from '~/composables/useGetSuggestions'
export default defineComponent({
  name: 'SearchFormLocality',
  components: {
    SearchFieldsWrapper,
    SearchActions,
    FilterMap,
    InputSearch,
    FilterReference,
    FilterInputAutocompleteStatic,
    FilterInputText,
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
      get: () => $accessor.search.locality.query,
      set: (val) => {
        $accessor.search.locality.setQuery(val)
      },
    })

    const name = useFilter('locality', 'name', handleUpdate)
    const country = useFilter('locality', 'country', handleUpdate)
    const reference = useFilter('locality', 'reference', handleUpdate)
    const map = useFilter('locality', 'map', handleUpdate)
    const state = reactive({
      countrySuggestions: [] as any[],
    })
    const hydrateFilterReference = useHydrateFilterReference()
    const hydrateFilterStatic = useHydrateFilterStatic()
    const getSuggestions = useGetSuggestions()
    useFetch(async () => {
      emitUpdate.value = false
      const countrySuggestionPromise = getSuggestions(
        'locality',
        'country_id,country,country_en',
        { et: 'country', en: 'country_en' }
      )

      const [countrySuggestions] = await Promise.all([
        countrySuggestionPromise,
        hydrateFilterReference(reference, 'reference'),
      ])
      state.countrySuggestions = countrySuggestions
      hydrateFilterStatic(country, 'country', state.countrySuggestions, Number)
      emitUpdate.value = true
    })
    return {
      ...toRefs(state),
      name,
      query,
      reference,
      country,
      map,
      handleReset,
      handleUpdate,
    }
  },
})
</script>
