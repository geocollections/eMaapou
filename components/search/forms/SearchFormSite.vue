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
        <filter-input-autocomplete-new
          v-model="project"
          :title="$t('filters.project').toString()"
          static
          :query-field="
            $i18n.locale === 'et' ? 'project_name' : 'project_name_en'
          "
          :query-function="querySuggestionsProject"
        />
        <filter-input-autocomplete-new
          v-model="area"
          :title="$t('filters.area').toString()"
          :query-field="$i18n.locale === 'et' ? 'area_name' : 'area_name_en'"
          :query-function="querySuggestionsArea"
        />
        <filter-map v-model="map" :items="$accessor.search.site.items" />
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
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
import {
  useHydrate,
  useHydrateFilterNew,
  useHydrateStatic,
} from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
import {
  useQuerySuggestions,
  useQuerySuggestionsStatic,
} from '~/composables/useQuerySuggestions'
export default defineComponent({
  name: 'SearchFormSite',
  components: {
    SearchActions,
    FilterInputText,
    FilterMap,
    InputSearch,
    FilterInputAutocompleteNew,
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
    const filters = computed(() => $accessor.search.site.filters)
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

    watch(
      () => route.value.query,
      () => fetch()
    )

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false
      await Promise.all([
        hydrateFilter(area, toRef(filters.value, 'area'), 'area', hydrateArea),
        hydrateFilter(
          project,
          toRef(filters.value, 'project'),
          'project',
          hydrateProject
        ),
      ])

      emitUpdate.value = true
    })
    const hydrateFilter = useHydrateFilterNew()
    const hydrateStatic = useHydrateStatic()
    const hydrate = useHydrate()
    const hydrateProject = hydrateStatic(query, {
      pivot: ['project_id', 'project_name', 'project_name_en'],
      countResourceRelatedIdKey: 'project_id',
      countResource: 'site',
      countHierarchical: false,
      filters,
      tagFilterKey: 'project',
    })
    const hydrateArea = hydrate(
      filters.value.area,
      query,
      {
        itemResource: 'area',
        itemFields: ['id', 'name', 'name_en'],
        itemSearchField: 'id',
        countResource: 'site',
        countResourceRelatedIdKey: 'area_id',
        countHierarchical: false,
        tagFilterKey: 'area',
        filters,
      },
      (items, counts) =>
        items.map((item: any) => ({
          id: parseInt(item.id),
          text: item.name,
          text_en: item.name_en,
          count: counts[item.id],
        }))
    )
    const querySuggestionsStatic = useQuerySuggestionsStatic()
    const querySuggestionsProject = querySuggestionsStatic(query, {
      resource: 'site',
      excludeFilterKey: 'project',
      pivot: ['project_id', 'project_name', 'project_name_en'],
      limit: 200,
      filters,
    })
    const querySuggestions = useQuerySuggestions()
    const querySuggestionsArea = querySuggestions(query, {
      resource: 'site',
      pivot: ['area_id', 'area_name', 'area_name_en'],
      pivotOffsetField: 'area_id',
      countHierarchical: false,
      countResourceRelatedKey: 'area_id',
      excludeFilterKey: 'area',
      filters,
    })
    return {
      querySuggestionsProject,
      querySuggestionsArea,
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
