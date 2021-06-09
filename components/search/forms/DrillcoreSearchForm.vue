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
      <text-field
        v-model="repository"
        :label="$t(filters.byIds.repository.label)"
      />
      <text-field v-model="country" :label="$t(filters.byIds.country.label)" />
      <text-field v-model="storage" :label="$t(filters.byIds.storage.label)" />
      <range-text-field
        v-model="boxes"
        :label="$t(filters.byIds.boxes.label)"
      />
    </search-fields-wrapper>

    <institution-search-filter
      class="mt-2"
      :institution="institution"
      @change:institution="institution = $event"
    />

    <extra-options class="mt-2" />
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import InstitutionSearchFilter from '@/components/search/InstitutionSearchFilter.vue'
import GlobalSearch from '../GlobalSearch.vue'
import ResetSearchButton from '../ResetSearchButton.vue'
import SearchButton from '../SearchButton.vue'
import SearchFieldsWrapper from '../SearchFieldsWrapper.vue'
import RangeTextField from '~/components/fields/RangeTextField.vue'
import TextField from '~/components/fields/TextField.vue'
import ExtraOptions from '~/components/search/ExtraOptions.vue'

export default {
  name: 'DrillcoreSearchForm',
  components: {
    ExtraOptions,
    InstitutionSearchFilter,
    TextField,
    RangeTextField,
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
    SearchFieldsWrapper,
  },
  computed: {
    ...mapState('drillcore', ['filters']),
    ...mapFields('drillcore', {
      name: 'filters.byIds.name.value',
      repository: 'filters.byIds.repository.value',
      country: 'filters.byIds.country.value',
      boxes: 'filters.byIds.boxes.value',
      storage: 'filters.byIds.storage.value',
    }),
    ...mapFields('globalSearch', {
      institution: 'filters.byIds.institution.value',
    }),
  },
  methods: {
    ...mapActions('drillcore', ['searchDrillcores', 'resetDrillcoreFilters']),
    ...mapActions('landing', ['resetSearch']),
    handleReset(e) {
      this.resetSearch()
      this.resetDrillcoreFilters()
      this.searchDrillcores()
    },
    handleSearch(e) {
      this.searchDrillcores()
    },
  },
}
</script>
