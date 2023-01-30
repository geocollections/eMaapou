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
          v-model="county"
          :title="$t('filters.county').toString()"
          :items="countySuggestions"
          :filter-field="$translate({ et: 'text', en: 'text_en' })"
        />
        <filter-input-autocomplete-static
          v-model="type"
          :title="$t('filters.areaType').toString()"
          :items="typeSuggestions"
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
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import FilterInputAutocompleteStatic from '~/components/filter/input/FilterInputAutocompleteStatic.vue'
import { useFilter } from '~/composables/useFilter'
import { useHydrateFilterStatic } from '~/composables/useHydrateFilter'
import { useGetSuggestions } from '~/composables/useGetSuggestions'
export default defineComponent({
  name: 'SearchFormArea',
  components: {
    SearchActions,
    InputSearch,
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
    const getSuggestions = useGetSuggestions()
    const hydrateFilterStatic = useHydrateFilterStatic()

    watch(
      () => route.value.query,
      () => fetch()
    )

    const { fetch } = useFetch(async () => {
      emitUpdate.value = false
      await Promise.all([
        getSuggestions(
          toRef(state, 'countySuggestions'),
          'area',
          'maakond_id,maakond,maakond_en',
          {
            et: 'maakond',
            en: 'maakond_en',
          }
        ),
        getSuggestions(
          toRef(state, 'typeSuggestions'),
          'area',
          'area_type_id,area_type,area_type_en',
          {
            et: 'area_type',
            en: 'area_type_en',
          }
        ),
      ])
      hydrateFilterStatic(type, 'type', state.typeSuggestions, Number)
      hydrateFilterStatic(county, 'county', state.countySuggestions, Number)
      emitUpdate.value = true
    })
    return {
      ...toRefs(state),
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
