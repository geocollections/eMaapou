<template>
  <search>
    <template #title>
      <page-title-wrapper
        :title="$t('common.datasetCount')"
        :count="count"
        icon="mdi-screw-machine-flat-top"
      />
    </template>

    <template #form>
      <dataset-search-form />
    </template>

    <template #result>
      <dataset-table
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
import PageTitleWrapper from '~/components/search/PageTitleWrapper'
import DatasetTable from '~/components/tables/DatasetTable'
import DatasetSearchForm from '~/components/search/forms/DatasetSearchForm'
import Search from '~/components/templates/Search'

export default {
  components: {
    Search,
    DatasetSearchForm,
    DatasetTable,
    PageTitleWrapper,
  },
  head() {
    return {
      title: this.$t('dataset.pageTitle'),
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('dataset', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('dataset', ['searchDatasets']),
    async handleUpdate(tableState) {
      await this.searchDatasets(tableState.options)
    },
  },
}
</script>
