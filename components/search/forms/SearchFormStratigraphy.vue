<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <v-expansion-panels accordion flat tile multiple>
        <filter-stratigraphy v-model="stratigraphyHierarchy" />

        <filter-input-text
          v-model="index"
          :title="$t('filters.index').toString()"
        />
        <filter-input-text
          v-model="age"
          :title="$t('filters.age').toString()"
        />
        <filter-input-autocomplete-static
          v-model="type"
          :title="$t('filters.type').toString()"
          :items="typeSuggestions"
          :filter-field="$translate({ et: 'text', en: 'text_en' })"
        />
        <filter-input-autocomplete-static
          v-model="rank"
          :title="$t('filters.rank').toString()"
          :items="rankSuggestions"
          :filter-field="$translate({ et: 'text', en: 'text_en' })"
        />
        <filter-input-autocomplete-static
          v-model="scope"
          :title="$t('filters.scope').toString()"
          :items="scopeSuggestions"
          :filter-field="$translate({ et: 'text', en: 'text_en' })"
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
import FilterStratigraphy from '~/components/filter/FilterStratigraphy.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import {
  useHydrateFilterStatic,
  useHydrateFilterStratigraphy,
} from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
import { useGetSuggestions } from '~/composables/useGetSuggestions'
export default defineComponent({
  name: 'SearchFormStratigraphy',
  components: {
    SearchActions,
    InputSearch,
    FilterStratigraphy,
    FilterInputText,
    FilterInputAutocompleteStatic,
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
      get: () => $accessor.search.stratigraphy.query,
      set: (val) => {
        $accessor.search.stratigraphy.setQuery(val)
      },
    })
    const stratigraphyHierarchy = useFilter(
      'stratigraphy',
      'stratigraphyHierarchy',
      handleUpdate
    )
    const index = useFilter('stratigraphy', 'index', handleUpdate)
    const age = useFilter('stratigraphy', 'age', handleUpdate)
    const rank = useFilter('stratigraphy', 'rank', handleUpdate)
    const scope = useFilter('stratigraphy', 'scope', handleUpdate)
    const type = useFilter('stratigraphy', 'type', handleUpdate)
    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()
    const hydrateFilterStatic = useHydrateFilterStatic()
    const state = reactive({
      rankSuggestions: [] as any[],
      scopeSuggestions: [] as any[],
      typeSuggestions: [] as any[],
    })
    const getSuggestions = useGetSuggestions()

    watch(() => route.value.query, () => fetch())

    const {fetch} = useFetch(async () => {
      emitUpdate.value = false
      const suggestionPromise = Promise.all([
        getSuggestions(
          toRef(state, 'rankSuggestions'),
          'stratigraphy',
          'rank,stratigraphy_rank,stratigraphy_rank_en',
          { et: 'stratigraphy_rank', en: 'stratigraphy_rank_en' }
        ),
        getSuggestions(
          toRef(state, 'scopeSuggestions'),
          'stratigraphy',
          'scope,stratigraphy_scope,stratigraphy_scope_en',
          { et: 'stratigraphy_scope', en: 'stratigraphy_scope_en' }
        ),
        getSuggestions(
          toRef(state, 'typeSuggestions'),
          'stratigraphy',
          'type,stratigraphy_type,stratigraphy_type_en',
          { et: 'stratigraphy_type', en: 'stratigraphy_type_en' }
        ),
      ])
      await Promise.all([
        suggestionPromise,
        hydrateFilterStratigraphy(
          stratigraphyHierarchy,
          'stratigraphyHierarchy'
        ),
      ])
      hydrateFilterStatic(type, 'type', state.typeSuggestions, Number)
      hydrateFilterStatic(rank, 'rank', state.rankSuggestions, Number)
      hydrateFilterStatic(scope, 'scope', state.scopeSuggestions, Number)
      emitUpdate.value = true
    })
    return {
      ...toRefs(state),
      query,
      stratigraphyHierarchy,
      index,
      age,
      rank,
      scope,
      type,
      handleReset,
      handleUpdate,
    }
  },
})
</script>
