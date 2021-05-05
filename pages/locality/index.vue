<template>
  <search>
    <template #title>
      <page-title-wrapper
        :title="$t('common.localitiesCount')"
        :count="count"
        icon="mdi-map-marker-outline"
      />
    </template>

    <template #form>
      <locality-search-form />
    </template>

    <template #result>
      <search-view-map-wrapper locality-overlay :items="items" class="mb-6" />
      <locality-table
        :show-search="false"
        :items="items"
        :count="count"
        :options="options"
        @update="handleUpdate"
      />
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LocalitySearchForm from '@/components/search/forms/LocalitySearchForm'
import LocalityTable from '~/components/tables/LocalityTable.vue'
import PageTitleWrapper from '~/components/search/PageTitleWrapper'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import Search from '~/components/templates/Search'

export default {
  components: {
    Search,
    SearchViewMapWrapper,
    PageTitleWrapper,
    LocalityTable,
    LocalitySearchForm,
  },
  head() {
    return {
      title: this.$t('locality.pageTitle'),
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('locality', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('locality', ['searchLocalities']),
    async handleUpdate(tableState) {
      await this.searchLocalities(tableState.options)
    },
  },
}
</script>
