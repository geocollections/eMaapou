<template>
  <v-form @submit.prevent="handleSearch">
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('image')">
      <text-field
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />

      <text-field v-model="people" :label="$t(filters.byIds.people.label)" />

      <text-field v-model="tags" :label="$t(filters.byIds.tags.label)" />

      <text-field v-model="country" :label="$t(filters.byIds.country.label)" />

      <range-text-field v-model="date" :label="$t(filters.byIds.date.label)" />

      <text-field
        v-model="dateFree"
        :label="$t(filters.byIds.dateFree.label)"
      />

      <text-field
        v-model="imageNumber"
        :label="$t(filters.byIds.imageNumber.label)"
      />

      <text-field v-model="author" :label="$t(filters.byIds.author.label)" />

      <text-field
        v-model="imageSize"
        :label="$t(filters.byIds.imageSize.label)"
      />
    </search-fields-wrapper>
    <search-view-map-wrapper
      use-custom-markers
      :items="markers"
      class="mt-2"
      :active="geoJSON !== null"
      @update="handleMapUpdate"
    />
    <institution-search-filter
      class="mt-2"
      :active="!isEmpty(institution)"
      :institution="institution"
      @change:institution="institution = $event"
    />

    <extra-options class="mt-2" />
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { isEmpty } from 'lodash'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import TextField from '~/components/fields/TextField.vue'
import InstitutionSearchFilter from '~/components/search/InstitutionSearchFilter'
import RangeTextField from '~/components/fields/RangeTextField'
import ExtraOptions from '~/components/search/ExtraOptions'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'

export default {
  name: 'PhotoSearchForm',
  components: {
    ExtraOptions,
    RangeTextField,
    InstitutionSearchFilter,
    TextField,
    SearchFieldsWrapper,
    SearchActions,
    SearchViewMapWrapper,
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
    handleSearch(e) {
      this.searchImages()
    },
    async handleReset(e) {
      await this.resetFilters('image')
      this.searchImages()
    },
    handleMapUpdate(tableState) {
      this.searchImages(tableState?.options)
    },
  },
}
</script>
