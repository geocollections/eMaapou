<template>
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
      <!-- <input-text v-model="name" :label="$t(filters.byIds.name.label)" />
      <input-text v-model="area" :label="$t(filters.byIds.area.label)" />
      <input-text v-model="project" :label="$t(filters.byIds.project.label)" /> -->
    </search-fields-wrapper>
    <!-- <search-map
      site-overlay
      :items="items"
      class="mt-2"
      :active="geoJSON != null"
      @update="handleMapUpdate"
    /> -->
  </v-form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
// import InputText from '../../input/InputText.vue'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
// import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterArea from '~/components/filter/FilterArea.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import { useHydrateFilterArea } from '~/composables/useHydrateFilter'
export default defineComponent({
  name: 'SearchFormSite',
  components: {
    // InputText,
    SearchFieldsWrapper,
    SearchActions,
    FilterInputText,
    FilterArea,
    FilterMap,
    FilterInputAutocompleteStatic,
    // SearchMap,
    InputSearch,
  },
  setup(_props, { emit }) {
    const { $accessor, i18n, $axios } = useContext()
    const route = useRoute()
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
      get: () => $accessor.search.site.query,
      set: (val) => {
        $accessor.search.site.setQuery(val)
      },
    })
    const name = computed({
      get: () => $accessor.search.site.filters.byIds.name.value,
      set: (value) => {
        $accessor.search.site.setFilterValue({ key: 'name', value })
        handleSearch()
      },
    })
    const area = computed({
      get: () => $accessor.search.site.filters.byIds.area.value,
      set: (value) => {
        $accessor.search.site.setFilterValue({ key: 'area', value })
        handleSearch()
      },
    })
    const map = computed({
      get: () => $accessor.search.site.filters.byIds.map.value,
      set: (value) => {
        $accessor.search.site.setFilterValue({ key: 'map', value })
        handleSearch()
      },
    })
    const project = computed({
      get: () => $accessor.search.site.filters.byIds.project.value,
      set: (value) => {
        $accessor.search.site.setFilterValue({ key: 'project', value })
        handleSearch()
      },
    })
    const hydrateFilterArea = useHydrateFilterArea()
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
      if (route.value.query.area) {
        area.value = (
          await hydrateFilterArea(
            (route.value.query.area as string).split(',').map(Number)
          )
        ).data.response.docs
      }
      if (route.value.query.project) {
        const methodIds = (route.value.query.project as string)
          .split(',')
          .map(Number)
        project.value = state.projectSuggestions.filter((project) =>
          methodIds.includes(project.id)
        )
      }
    })
    return {
      ...toRefs(state),
      query,
      name,
      area,
      map,
      project,
      handleReset,
      handleMapUpdate,
      handleSearch,
    }
  },
})
</script>
