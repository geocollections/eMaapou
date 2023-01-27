<template>
  <div>
    <v-form @submit.prevent="handleUpdate">
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
  ref,
  toRefs,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
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
    SearchFieldsWrapper,
    SearchActions,
    InputSearch,
    FilterInputText,
    FilterInputAutocompleteStatic,
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
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
    useFetch(async () => {
      emitUpdate.value = false
      const [countySuggestions, typeSuggestions] = await Promise.all([
        getSuggestions('area', 'maakond_id,maakond,maakond_en', {
          et: 'maakond',
          en: 'maakond_en',
        }),
        getSuggestions('area', 'area_type_id,area_type,area_type_en', {
          et: 'area_type',
          en: 'area_type_en',
        }),
      ])
      state.countySuggestions = countySuggestions
      state.typeSuggestions = typeSuggestions
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
