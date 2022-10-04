<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('specimen')">
      <input-text v-model="number" :label="$t(filters.byIds.number.label)" />

      <input-text
        v-model="collectionNr"
        :label="$t(filters.byIds.collectionNr.label)"
      />
      <input-text
        v-model="locality"
        :label="$t(filters.byIds.locality.label)"
      />
      <input-autocomplete
        v-model="stratigraphyHierarchy"
        :items="autocomplete.stratigraphy"
        :loading="autocomplete.loaders.stratigraphy"
        :label="$t(filters.byIds.stratigraphyHierarchy.label)"
        :item-text="stratigraphyLabel"
        @search:items="autocompleteStratigraphySearch"
      />

      <input-autocomplete
        v-model="hierarchy"
        :items="autocomplete.taxon"
        :loading="autocomplete.loaders.taxon"
        :label="$t(filters.byIds.hierarchy.label)"
        :item-text="hierarchyLabel"
        @search:items="autocompleteHierarchySearch"
      />

      <input-autocomplete
        v-model="reference"
        :items="autocomplete.reference"
        :loading="autocomplete.loaders.reference"
        :label="$t(filters.byIds.reference.label)"
        item-text="reference"
        no-filter
        do-not-cache
        append-item="title"
        @search:items="autocompleteReferenceSearch"
      />

      <input-text
        v-model="fossilName"
        :label="$t(filters.byIds.fossilName.label)"
      />

      <input-text v-model="fossil" :label="$t(filters.byIds.fossil.label)" />

      <input-text v-model="rock" :label="$t(filters.byIds.rock.label)" />

      <input-checkbox
        v-model="has_image"
        :label="$t(filters.byIds.has_image.label)"
      />

      <input-checkbox
        v-model="has_map"
        :label="$t(filters.byIds.has_map.label)"
      />
    </search-fields-wrapper>

    <search-map
      sample-overlay
      :items="items"
      class="mt-2"
      :active="geoJSON != null"
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

import autocompleteMixin from '~/mixins/autocompleteMixin'

export default {
  name: 'SearchFormSpecimen',
  mixins: [autocompleteMixin],
  data() {
    return {
      autocomplete: {
        stratigraphy: [],
        taxon: [],
        reference: [],
        loaders: {
          stratigraphy: false,
          taxon: false,
          reference: false,
        },
      },
    }
  },
  computed: {
    ...mapState('search/specimen', ['filters', 'count', 'items']),
    ...mapFields('search/specimen', {
      number: 'filters.byIds.number.value',
      collectionNr: 'filters.byIds.collectionNr.value',
      locality: 'filters.byIds.locality.value',
      fossilName: 'filters.byIds.fossilName.value',
      fossil: 'filters.byIds.fossil.value',
      rock: 'filters.byIds.rock.value',
      reference: 'filters.byIds.reference.value',
      stratigraphyHierarchy: 'filters.byIds.stratigraphyHierarchy.value',
      hierarchy: 'filters.byIds.hierarchy.value',
      has_image: 'filters.byIds.has_image.value',
      has_map: 'filters.byIds.has_map.value',
      query: 'query',
    }),
    ...mapFields('search', {
      institution: 'globalFilters.byIds.institutions.value',
      geoJSON: 'globalFilters.byIds.geoJSON.value',
    }),
    ...mapGetters('search', ['hasActiveFilters']),
  },
  created() {
    this.fillAutocompleteLists()
  },
  methods: {
    isEmpty,
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/specimen', ['searchSpecimens']),
    handleSearch(e) {
      this.searchSpecimens()
    },
    async handleReset(e) {
      await this.resetFilters('specimen')
      this.searchSpecimens()
    },
    fillAutocompleteLists() {
      if (this.stratigraphyHierarchy)
        this.autocomplete.stratigraphy.push(this.stratigraphyHierarchy)
      if (this.reference) this.autocomplete.reference.push(this.reference)
      if (this.hierarchy) this.autocomplete.taxon.push(this.hierarchy)
    },
    handleMapUpdate(tableState) {
      this.searchSpecimens(tableState?.options)
    },
  },
}
</script>
