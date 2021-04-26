<template>
  <div>
    <page-title-wrapper
      :title="$t('common.datasetCount')"
      :count="count"
      icon="mdi-screw-machine-flat-top"
    />
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-3">
          <dataset-search-form />
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <dataset-table
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          @update="handleUpdate"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PageTitleWrapper from '~/components/search/PageTitleWrapper'
import DatasetTable from '~/components/tables/DatasetTable'
import DatasetSearchForm from '~/components/search/forms/DatasetSearchForm'

export default {
  components: {
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
