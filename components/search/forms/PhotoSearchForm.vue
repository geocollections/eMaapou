<template>
  <v-form @submit.prevent="handleSearch">
    <global-search />
    <div class="mt-2 d-flex justify-end align-center">
      <reset-search-button @click="handleReset" />
      <search-button />
    </div>
    <text-field v-model="locality" :label="$t(filters.byIds.locality.label)" />

    <text-field v-model="people" :label="$t(filters.byIds.people.label)" />

    <text-field v-model="tags" :label="$t(filters.byIds.tags.label)" />

    <text-field v-model="country" :label="$t(filters.byIds.country.label)" />

    <range-text-field v-model="date" :label="$t(filters.byIds.date.label)" />

    <text-field v-model="dateFree" :label="$t(filters.byIds.dateFree.label)" />

    <text-field
      v-model="imageNumber"
      :label="$t(filters.byIds.imageNumber.label)"
    />

    <text-field v-model="author" :label="$t(filters.byIds.author.label)" />

    <text-field
      v-model="imageSize"
      :label="$t(filters.byIds.imageSize.label)"
    />

    <institution-search-filter
      class="pt-3"
      :institution="institution"
      @change:institution="institution = $event"
    />
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'
import TextField from '~/components/fields/TextField.vue'
import InstitutionSearchFilter from '~/components/search/InstitutionSearchFilter'
import RangeTextField from '~/components/fields/RangeTextField'

export default {
  name: 'PhotoSearchForm',
  components: {
    RangeTextField,
    InstitutionSearchFilter,
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
  },
  computed: {
    ...mapState('image', ['filters']),
    ...mapFields('image', {
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
    ...mapFields('globalSearch', {
      institution: 'filters.byIds.institution.value',
    }),
  },
  methods: {
    ...mapActions('image', ['searchImages', 'resetImageFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchImages()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetImageFilters()
      this.searchImages()
    },
  },
}
</script>
