<template>
  <div>
    <v-form @submit.prevent="handleSearch">
      <input-search v-model="query" />
      <search-actions class="mb-3" @click="handleReset" />
      <search-fields-wrapper>
        <v-card class="mt-3" flat tile color="transparent">
          <v-expansion-panels accordion flat tile multiple>
            <filter-locality v-model="locality" />
            <filter-map v-model="map" :items="$accessor.search.image.items" />
            <filter-input-text
              v-model="people"
              :title="$t('filters.people').toString()"
            />
            <filter-input-text
              v-model="tags"
              :title="$t('filters.tags').toString()"
            />
            <filter-institution v-model="institutions" />
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
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import { useFilter } from '~/composables/useFilter'
import FilterLocality from '~/components/filter/FilterLocality.vue'
import FilterInputText from '~/components/filter/input/FilterInputText.vue'
import { useHydrateFilterLocality } from '~/composables/useHydrateFilter'
import FilterMap from '~/components/filter/FilterMap.vue'
import FilterInstitution from '~/components/filter/FilterInstitution.vue'
export default defineComponent({
  name: 'SearchFormPhoto',
  components: {
    SearchFieldsWrapper,
    SearchActions,
    InputSearch,
    FilterLocality,
    FilterInputText,
    FilterMap,
    FilterInstitution,
  },
  props: {
    markers: {
      type: Array,
      default: () => [],
    },
  },
  setup(_props, { emit }) {
    const { $accessor } = useContext()
    const route = useRoute()
    const handleSearch = () => {
      emit('update')
    }
    const handleReset = () => {
      emit('reset')
    }

    const query = computed({
      get: () => $accessor.search.image.query,
      set: (val) => {
        $accessor.search.image.setQuery(val)
      },
    })

    const locality = useFilter('image', 'locality', handleSearch)
    const people = useFilter('image', 'people', handleSearch)
    const tags = useFilter('image', 'tags', handleSearch)
    const map = useFilter('image', 'map', handleSearch)
    const institutions = computed({
      get: () => $accessor.search.globalFilters.institutions.value,
      set: (val) => {
        $accessor.search.setInstitutionsFilter(val)
        handleSearch()
      },
    })
    const hydrateFilterLocality = useHydrateFilterLocality()
    useFetch(async () => {
      if (route.value.query.locality) {
        locality.value = (
          await hydrateFilterLocality(
            (route.value.query.locality as string).split(',').map(Number)
          )
        ).data.response.docs
      }
    })
    return {
      handleSearch,
      handleReset,
      query,
      locality,
      people,
      tags,
      map,
      institutions,
    }
  },
})
</script>
