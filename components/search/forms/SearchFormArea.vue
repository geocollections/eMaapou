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
          v-model="county"
          :title="$t('filters.county').toString()"
          static
          :query-field="$i18n.locale == 'et' ? 'maakond' : 'maakond_en'"
          :query-function="querySuggestionsCounty"
        />
        <filter-input-autocomplete-new
          v-model="type"
          :title="$t('filters.areaType').toString()"
          static
          :query-field="$i18n.locale == 'et' ? 'area_type' : 'area_type_en'"
          :query-function="querySuggestionsType"
        />
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
import FilterInputAutocompleteNew from '~/components/filter/input/FilterInputAutocompleteNew.vue'
import { useFilter } from '~/composables/useFilter'
import {
  useHydrateFilterNew,
  useHydrateStatic,
} from '~/composables/useHydrateFilter'
import { useQuerySuggestionsStatic } from '~/composables/useQuerySuggestions'
export default defineComponent({
  name: 'SearchFormArea',
  components: {
    SearchActions,
    InputSearch,
    FilterInputText,
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
    const filters = computed(() => $accessor.search.area.filters)
    const query = computed({
      get: () => $accessor.search.area.query,
      set: (val) => {
        $accessor.search.area.setQuery(val)
      },
    })
    const name = useFilter('area', 'name', handleUpdate)
    const type = useFilter('area', 'type', handleUpdate)
    const county = useFilter('area', 'county', handleUpdate)
    const state = reactive({
      countySuggestions: [] as any[],
      typeSuggestions: [] as any[],
    })

    watch(
      () => route.value.query,
      () => fetch()
    )

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false
      await Promise.all([
        hydrateFilter(
          county,
          toRef(filters.value, 'county'),
          'county',
          hydrateCounty
        ),
        hydrateFilter(type, toRef(filters.value, 'type'), 'type', hydrateType),
      ])
      emitUpdate.value = true
    })

    const hydrateFilter = useHydrateFilterNew()
    const hydrateStatic = useHydrateStatic()
    const hydrateCounty = hydrateStatic(query, {
      pivot: ['maakond_id', 'maakond', 'maakond_en'],
      countResourceRelatedIdKey: 'maakond_id',
      countResource: 'area',
      countHierarchical: false,
      filters,
      tagFilterKey: 'county',
    })
    const hydrateType = hydrateStatic(query, {
      pivot: ['area_type_id', 'area_type', 'area_type_en'],
      countResourceRelatedIdKey: 'area_type_id',
      countResource: 'area',
      countHierarchical: false,
      filters,
      tagFilterKey: 'type',
    })
    const querySuggestionsStatic = useQuerySuggestionsStatic()
    const querySuggestionsCounty = querySuggestionsStatic(query, {
      resource: 'area',
      excludeFilterKey: 'county',
      pivot: ['maakond_id', 'maakond', 'maakond_en'],
      limit: 20,
      filters,
    })
    const querySuggestionsType = querySuggestionsStatic(query, {
      resource: 'area',
      excludeFilterKey: 'type',
      pivot: ['area_type_id', 'area_type', 'area_type_en'],
      limit: 20,
      filters,
    })
    return {
      ...toRefs(state),
      querySuggestionsCounty,
      querySuggestionsType,
      query,
      name,
      county,
      type,
      handleReset,
      handleUpdate,
    }
  },
})
</script>
