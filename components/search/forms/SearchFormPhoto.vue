<template>
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
      <!-- <input-text
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />

      <input-text v-model="people" :label="$t(filters.byIds.people.label)" />

      <input-text v-model="tags" :label="$t(filters.byIds.tags.label)" />

      <input-text v-model="country" :label="$t(filters.byIds.country.label)" />

      <input-range v-model="date" :label="$t(filters.byIds.date.label)" />

      <input-text
        v-model="dateFree"
        :label="$t(filters.byIds.dateFree.label)"
      />

      <input-text
        v-model="imageNumber"
        :label="$t(filters.byIds.imageNumber.label)"
      />

      <input-text v-model="author" :label="$t(filters.byIds.author.label)" />

      <input-text
        v-model="imageSize"
        :label="$t(filters.byIds.imageSize.label)"
      /> -->
    </search-fields-wrapper>
    <!-- <search-map
      use-custom-markers
      :items="markers"
      class="mt-2"
      :active="geoJSON !== null"
      @update="handleMapUpdate"
    />
    <search-institution-filter
      class="mt-2"
      :active="!isEmpty(institution)"
      :institution="institution"
      @change:institution="handleInstitutionsUpdate"
    /> -->
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
// import SearchInstitutionFilter from '~/components/search/SearchInstitutionFilter.vue'
// import InputRange from '~/components/input/InputRange.vue'
// import SearchMap from '~/components/search/SearchMap.vue'
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
    // InputRange,
    // SearchInstitutionFilter,
    // InputText,
    SearchFieldsWrapper,
    SearchActions,
    // SearchMap,
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
