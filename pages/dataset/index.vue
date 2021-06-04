<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.datasetCount')"
        :subtitle="$t('common.count', { count: count })"
        icon="mdi-screw-machine-flat-top"
        class="title-dataset"
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
        use-dynamic-headers
        @update="handleUpdate"
      />
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DatasetTable from '~/components/tables/DatasetTable'
import DatasetSearchForm from '~/components/search/forms/DatasetSearchForm'
import Search from '~/components/templates/Search'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    DatasetSearchForm,
    DatasetTable,
    TitleCard,
  },
  mixins: [dynamicTableHeaders],
  head() {
    return {
      title: this.$t('dataset.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('dataset.pageTitle'),
        },
      ],
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('dataset', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('dataset', ['searchDatasets']),
    async handleUpdate(tableState) {
      await this.searchDatasets(tableState?.options)
    },
  },
}
</script>
