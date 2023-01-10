<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" @click="handleReset" />
    <search-fields-wrapper>
      <v-card class="mt-3" flat tile color="transparent">
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
        </v-expansion-panels>
      </v-card>
    </search-fields-wrapper>
  </v-form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
// import InputText from '~/components/input/InputText.vue'
// import InputAutocompleteStratigraphy from '~/components/input/InputAutocompleteStratigraphy.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import FilterStratigraphy from '~/components/filter/FilterStratigraphy.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import { useHydrateFilterStratigraphy } from '~/composables/useHydrateFilter'
import { useFilter } from '~/composables/useFilter'
export default defineComponent({
  name: 'SearchFormStratigraphy',
  components: {
    // InputText,
    // InputAutocompleteStratigraphy,
    SearchFieldsWrapper,
    SearchActions,
    InputSearch,
    FilterStratigraphy,
    FilterInputText,
  },

  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const route = useRoute()
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
    const stratigraphyHierarchy = useFilter(
      'stratigraphy',
      'stratigraphyHierarchy',
      handleSearch
    )
    const index = useFilter('stratigraphy', 'index', handleSearch)
    const age = useFilter('stratigraphy', 'age')

    const hydrateFilterStratigraphy = useHydrateFilterStratigraphy()
    useFetch(async () => {
      if (route.value.query.stratigraphyHierarchy) {
        stratigraphyHierarchy.value = (
          await hydrateFilterStratigraphy(
            (route.value.query.stratigraphyHierarchy as string)
              .split(',')
              .map((encodedValue) => decodeURIComponent(encodedValue))
          )
        ).data.response.docs
      }
    })
    return {
      query,
      stratigraphyHierarchy,
      index,
      age,
      handleReset,
      handleSearch,
    }
  },
})
</script>
