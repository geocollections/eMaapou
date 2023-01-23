<template>
  <div>
    <v-form @submit.prevent="handleSearch">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <search-fields-wrapper>
        <v-card class="mt-3" flat tile color="transparent">
          <v-expansion-panels accordion flat tile multiple>
            <filter-input-text
              v-model="name"
              :title="$t('filters.drillcoreName').toString()"
            />
            <filter-input-autocomplete-static
              v-model="country"
              :title="$t('filters.country').toString()"
              :items="countrySuggestions"
              :filter-field="$translate({ et: 'text', en: 'text_en' })"
            />

            <filter-map
              v-model="map"
              borehole-overlay
              :items="$accessor.search.drillcore.items"
            />
            <filter-input-autocomplete-static
              v-model="repository"
              :title="$t('filters.drillcoreRepository').toString()"
              :items="repositorySuggestions"
              :filter-field="$translate({ et: 'text', en: 'text_en' })"
            />

            <filter-input-range
              v-model="boxes"
              :label="$t('filters.drillcoreBoxes').toString()"
            />
            <filter-institution v-model="institutions" />
          </v-expansion-panels>
        </v-card>
      </search-fields-wrapper>
    </v-form>
  </div>
</template>

<script lang="ts">
import isEmpty from 'lodash/isEmpty'
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import FilterInputRange from '~/components/filter/input/FilterInputRange.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import { useFilter } from '~/composables/useFilter'
import { useHydrateFilterStatic } from '~/composables/useHydrateFilter'
import { useGetSuggestions } from '~/composables/useGetSuggestions'
export default defineComponent({
  name: 'SearchFormDrillcore',
  components: {
    SearchFieldsWrapper,
    SearchActions,
    InputSearch,
    FilterInputAutocompleteStatic,
    FilterInputRange,
    FilterInstitution,
    FilterMap,
    FilterInputText,
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const handleMapUpdate = () => {
      emit('update')
    }

    const query = computed({
      get: () => $accessor.search.drillcore.query,
      set: (val) => {
        $accessor.search.drillcore.setQuery(val)
      },
    })
    const name = useFilter('drillcore', 'name', handleSearch)
    const boxes = useFilter('drillcore', 'boxes', handleSearch)
    const country = useFilter('drillcore', 'country', handleSearch)
    const repository = useFilter('drillcore', 'repository', handleSearch)
    const map = useFilter('drillcore', 'map', handleSearch)
    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleSearch()
      },
    })
    const state = reactive({
      countrySuggestions: [] as any[],
      repositorySuggestions: [] as any[],
    })
    const hydrateFilterStatic = useHydrateFilterStatic()
    const getSuggestions = useGetSuggestions()
    useFetch(async () => {
      const [countrySuggestions, repositorySuggestions] = await Promise.all([
        getSuggestions('drillcore', 'country_id,country,country_en', {
          et: 'country',
          en: 'country_en',
        }),
        getSuggestions(
          'drillcore',
          'core_repository_id,core_repository,core_repository_en',
          { et: 'core_repository', en: 'core_repository_en' }
        ),
      ])
      state.repositorySuggestions = repositorySuggestions
      state.countrySuggestions = countrySuggestions
      hydrateFilterStatic(
        repository,
        'repository',
        state.repositorySuggestions,
        Number
      )
      hydrateFilterStatic(country, 'country', state.countrySuggestions, Number)
    })
    return {
      ...toRefs(state),
      query,
      country,
      repository,
      boxes,
      map,
      institutions,
      name,
      handleReset,
      handleSearch,
      handleMapUpdate,
      isEmpty,
    }
  },
})
</script>
