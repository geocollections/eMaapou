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
    const route = useRoute()
    const emitUpdate = ref(true)
    const hydrateFilters = ref(true)
    const handleReset = () => {
      emit('reset')
    }
    const handleUpdate = () => {
      if (!emitUpdate.value) return
      hydrateFilters.value = false
      emit('update')
    }

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
    const state = reactive({
      countrySuggestions: [] as any[],
      repositorySuggestions: [] as any[],
    })
    const hydrateFilterStatic = useHydrateFilterStatic()
    const getSuggestions = useGetSuggestions()

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
      await Promise.all([
        getSuggestions(
          toRef(state, 'countrySuggestions'),
          'drillcore',
          'country_id,country,country_en',
          {
            et: 'country',
            en: 'country_en',
          }
        ),
        getSuggestions(
          toRef(state, 'repositorySuggestions'),
          'drillcore',
          'core_repository_id,core_repository,core_repository_en',
          { et: 'core_repository', en: 'core_repository_en' }
        ),
      ])
      hydrateFilterStatic(
        repository,
        'repository',
        state.repositorySuggestions,
        Number
      )
      hydrateFilterStatic(country, 'country', state.countrySuggestions, Number)
      emitUpdate.value = true
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
      stratigraphyAge,
      handleReset,
      handleUpdate,
    }
  },
})
</script>
