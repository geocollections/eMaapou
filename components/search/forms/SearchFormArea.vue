<template>
  <v-form @submit.prevent="handleSearch">
    <input-search v-model="query" />
    <search-actions class="mb-3" :count="count" @click="handleReset" />
    <search-fields-wrapper :active="hasActiveFilters('area')">
      <input-text v-model="name" :label="$t(filters.byIds.name.label)" />
      <!--
        NOTE: Search on estonian county names. These don't contain spaces and therefore don't break the search.
        This probably won't be a problem in the future.
       -->
      <input-autocomplete
        v-model="county"
        :items="counties"
        :item-text="$i18n.locale === 'et' ? 'maakond' : 'maakond_en'"
        :item-value="'maakond'"
        :label="$t(filters.byIds.county.label)"
      />
      <!-- NOTE: Same as with counties above. But this might be a problem when new types are added. -->
      <input-autocomplete
        v-model="type"
        :items="types"
        :item-text="$i18n.locale === 'et' ? 'name' : 'name_en'"
        :item-value="'name'"
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
import InputText from '~/components/input/InputText.vue'
import InputSearch from '~/components/input/InputSearch.vue'
import InputAutocomplete from '~/components/input/InputAutocomplete.vue'
export default {
  name: 'SearchFormArea',
  components: {
    InputText,
    SearchFieldsWrapper,
    SearchActions,
    InputSearch,
    InputAutocomplete,
  },
  data() {
    return {
      counties: [],
      types: [],
    }
  },
  async fetch() {
    // TODO: Should await these requests together, so the first does not block the other
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
    handleSearch() {
      this.searchAreas()
    },
    async handleReset() {
      await this.resetFilters('area')
      this.searchAreas()
    },
    handleMapUpdate(tableState) {
      this.searchAreas(tableState?.options)
    },
  },
}
</script>
