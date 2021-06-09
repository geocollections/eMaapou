<template>
  <v-form @submit.prevent="handleSearch">
    <v-card flat tile color="transparent" class="mb-3">
      <v-card-title class="pl-2 py-1">{{
        $t('common.showSearch')
      }}</v-card-title>
      <global-search />
      <div class="mt-2 d-flex justify-end align-center">
        <reset-search-button @click="handleReset" />
        <search-button />
      </div>
    </v-card>
    <search-fields-wrapper>
      <text-field v-model="name" :label="$t(filters.byIds.name.label)" />
      <text-field v-model="area" :label="$t(filters.byIds.area.label)" />
      <text-field v-model="project" :label="$t(filters.byIds.project.label)" />
    </search-fields-wrapper>

    <extra-options class="mt-2" />
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import TextField from '../../fields/TextField.vue'
import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import ExtraOptions from '~/components/search/ExtraOptions'

export default {
  name: 'SiteSearchForm',
  components: {
    ExtraOptions,
    TextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
    SearchFieldsWrapper,
  },
  computed: {
    ...mapState('site', ['filters']),
    ...mapFields('site', {
      name: 'filters.byIds.name.value',
      latitude: 'filters.byIds.latitude.value',
      longitude: 'filters.byIds.longitude.value',
      area: 'filters.byIds.area.value',
      project: 'filters.byIds.project.value',
    }),
  },
  methods: {
    ...mapActions('site', ['searchSites', 'resetSiteFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleSearch(e) {
      this.searchSites()
    },
    handleReset(e) {
      this.resetSearch()
      this.resetSiteFilters()
      this.searchSites()
    },
  },
}
</script>
