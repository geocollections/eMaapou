<template>
  <v-form @submit.prevent="handleSearch">
    <query-search-field v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('area')">
      <text-field v-model="name" :label="$t(filters.byIds.name.label)" />
      <!--
        NOTE: item-value should probably be the id or mkood of the county.
        Right now the filter does not work correctly because of how we parse string filters.
       -->
      <autocomplete-field
        v-model="county"
        :items="counties"
        :return-object="false"
        :item-text="$i18n.locale === 'et' ? 'maakond' : 'maakond_en'"
        :item-value="$i18n.locale === 'et' ? 'maakond' : 'maakond_en'"
        do-not-cache
        :label="$t(filters.byIds.county.label)"
      />
      <!-- NOTE: same as above should use id of area_type. -->
      <autocomplete-field
        v-model="type"
        :items="types"
        :return-object="false"
        :item-text="$i18n.locale === 'et' ? 'name' : 'name_en'"
        :item-value="$i18n.locale === 'et' ? 'name' : 'name_en'"
        do-not-cache
        :label="$t(filters.byIds.type.label)"
      />
    </search-fields-wrapper>
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import SearchActions from '../SearchActions.vue'
import TextField from '~/components/fields/TextField.vue'
import QuerySearchField from '~/components/fields/QuerySearchField.vue'
import AutocompleteField from '~/components/fields/AutocompleteField.vue'
export default {
  name: 'AreaSearchForm',
  components: {
    TextField,
    SearchFieldsWrapper,
    SearchActions,
    QuerySearchField,
    AutocompleteField,
  },
  data() {
    return {
      counties: [],
      types: [],
    }
  },
  async fetch() {
    const countiesResponse = await this.$services.sarvREST.getResourceList(
      'list_maakond',
      {
        options: {
          page: 1,
          itemsPerPage: 20,
          sortBy: [],
          sortDesc: [],
        },
      }
    )

    const typesResponse = await this.$services.sarvREST.getResourceList(
      'area_type',
      {
        options: {
          page: 1,
          itemsPerPage: 20,
          sortBy: [],
          sortDesc: [],
        },
      }
    )
    this.types = typesResponse.items
    this.counties = countiesResponse.items
  },
  computed: {
    ...mapState('search/area', ['filters', 'count', 'items']),
    ...mapFields('search/area', {
      name: 'filters.byIds.name.value',
      county: 'filters.byIds.county.value',
      type: 'filters.byIds.type.value',
      query: 'query',
    }),
    ...mapGetters('search', ['hasActiveFilters']),
  },
  methods: {
    ...mapActions('search', ['resetFilters']),
    ...mapActions('search/area', ['searchAreas']),
    handleSearch(e) {
      this.searchAreas()
    },
    async handleReset(e) {
      await this.resetFilters('area')
      this.searchAreas()
    },
    handleMapUpdate(tableState) {
      this.searchAreas(tableState?.options)
    },
  },
}
</script>
