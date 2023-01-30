<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
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
    SearchActions,
    FilterInputText,
    FilterArea,
    FilterMap,
    FilterInputAutocompleteStatic,
    InputSearch,
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
    const query = computed({
      get: () => $accessor.search.site.query,
      set: (val) => {
        $accessor.search.site.setQuery(val)
      },
    })
    const name = useFilter('site', 'name', handleUpdate)
    const area = useFilter('site', 'area', handleUpdate)
    const map = useFilter('site', 'map', handleUpdate)
    const project = useFilter('site', 'project', handleUpdate)
    const hydrateFilterArea = useHydrateFilterArea()
    const hydrateFilterStatic = useHydrateFilterStatic()
    const state = reactive({
      projectSuggestions: [] as any[],
    })
    const getSuggestions = useGetSuggestions()

    watch(
      () => route.value.query,
      () => fetch()
    )

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false
      const projectSuggestionsPromise = getSuggestions(
        toRef(state, 'projectSuggestions'),
        'site',
        'project_id,project_name,project_name_en',
        { et: 'project_name', en: 'project_name_en' }
      )
      await Promise.all([
        projectSuggestionsPromise,
        hydrateFilterArea(area, 'area'),
      ])

      hydrateFilterStatic(project, 'project', state.projectSuggestions, Number)
      emitUpdate.value = true
    })
    return {
      ...toRefs(state),
      query,
      name,
      area,
      map,
      project,
      handleReset,
      handleUpdate,
    }
  },
})
</script>
