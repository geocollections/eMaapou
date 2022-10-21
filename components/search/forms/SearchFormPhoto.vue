<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('image')">
      <input-text
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
      />
    </search-fields-wrapper>
    <search-map
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
      @change:institution="institution = $event"
    />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import isEmpty from 'lodash/isEmpty'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import InputText from '~/components/input/InputText.vue'
import SearchInstitutionFilter from '~/components/search/SearchInstitutionFilter.vue'
import InputRange from '~/components/input/InputRange.vue'
import SearchMap from '~/components/search/SearchMap.vue'
import InputSearch from '~/components/input/InputSearch.vue'

export default {
  name: 'SearchFormPhoto',
  components: {
    InputRange,
    SearchInstitutionFilter,
    InputText,
    SearchFieldsWrapper,
    SearchActions,
    SearchMap,
    InputSearch,
  },
  props: {
    markers: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState('search/image', ['filters', 'count', 'items']),
    ...mapFields('search/image', {
      locality: 'filters.byIds.locality.value',
      people: 'filters.byIds.people.value',
      tags: 'filters.byIds.tags.value',
      country: 'filters.byIds.country.value',
      dateLookUpType: 'filters.byIds.date.lookUpType',
      date: 'filters.byIds.date.value',
      dateFree: 'filters.byIds.dateFree.value',
      imageNumber: 'filters.byIds.imageNumber.value',
      author: 'filters.byIds.author.value',
      imageSize: 'filters.byIds.imageSize.value',
      query: 'query',
    }),
    ...mapFields('search', {
      institution: 'globalFilters.byIds.institutions.value',
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('search', ['hasActiveFilters']),
  },
  methods: {
    isEmpty,
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/image', ['searchImages']),
    handleSearch() {
      this.searchImages()
    },
    async handleReset() {
      await this.resetFilters('image')
      this.searchImages()
    },
    handleMapUpdate(tableState) {
      this.searchImages(tableState?.options)
    },
  },
}
</script>
