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
              :filter-field="$translate({ et: 'project', en: 'project_en' })"
            >
              <template #selection="{ item }">
                <div>
                  {{ $translate({ et: item.project, en: item.project_en }) }}
                </div>
              </template>
              <template #suggestion="{ item }">
                <div>
                  {{ $translate({ et: item.project, en: item.project_en }) }}
                </div>
              </template>
            </filter-input-autocomplete-static>
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
    const { $accessor, i18n, $axios } = useContext()
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
    useFetch(async () => {
      const projectSortField =
        i18n.locale === 'et' ? 'project_name' : 'project_name_en'
      state.projectSuggestions = (
        await $axios.$get(
          `https://api.geoloogia.info/solr/site?q=%2A&start=0&rows=0&facet=true&facet.pivot=project_id,project_name,project_name_en&facet.limit=200&facet.sort=${projectSortField}`
        )
      ).facet_counts.facet_pivot['project_id,project_name,project_name_en'].map(
        (project: any) => {
          return {
            id: project.value,
            project: project.pivot[0].value,
            project_en: project.pivot[0].pivot?.[0].value
              ? project.pivot[0].pivot?.[0].value
              : project.pivot[0].value,
          }
        }
      )
      hydrateFilterStatic(project, 'project', state.projectSuggestions, Number)
      await hydrateFilterArea(area, 'area')
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
