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
              :title="$t('filters.name').toString()"
            />
            <filter-input-autocomplete-static
              v-model="project"
              :title="$t('filters.project').toString()"
              :items="projectSuggestions"
              :filter-field="$translate({ et: 'text', en: 'text_en' })"
            />
            <filter-area v-model="area" />
            <filter-map v-model="map" :items="$accessor.search.site.items" />
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
  toRefs,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterArea from '~/components/filter/FilterArea.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import {
  useHydrateFilterArea,
  useHydrateFilterStatic,
} from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
import { useGetSuggestions } from '~/composables/useGetSuggestions'
export default defineComponent({
  name: 'SearchFormSite',
  components: {
    SearchFieldsWrapper,
    SearchActions,
    FilterInputText,
    FilterArea,
    FilterMap,
    FilterInputAutocompleteStatic,
    InputSearch,
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const handleReset = () => {
      emit('reset')
    }
    const handleSearch = () => {
      emit('update')
    }
    const query = computed({
      get: () => $accessor.search.site.query,
      set: (val) => {
        $accessor.search.site.setQuery(val)
      },
    })
    const name = useFilter('site', 'name', handleSearch)
    const area = useFilter('site', 'area', handleSearch)
    const map = useFilter('site', 'map', handleSearch)
    const project = useFilter('site', 'project', handleSearch)
    const hydrateFilterArea = useHydrateFilterArea()
    const hydrateFilterStatic = useHydrateFilterStatic()
    const state = reactive({
      projectSuggestions: [] as any[],
    })
    const getSuggestions = useGetSuggestions()
    useFetch(async () => {
      const projectSuggestionsPromise = getSuggestions(
        'site',
        'project_id,project_name,project_name_en',
        { et: 'project_name', en: 'project_name_en' }
      )
      const [projectSuggestions] = await Promise.all([
        projectSuggestionsPromise,
        hydrateFilterArea(area, 'area'),
      ])

      state.projectSuggestions = projectSuggestions
      hydrateFilterStatic(project, 'project', state.projectSuggestions, Number)
    })
    return {
      ...toRefs(state),
      query,
      name,
      area,
      map,
      project,
      handleReset,
      handleSearch,
    }
  },
})
</script>
