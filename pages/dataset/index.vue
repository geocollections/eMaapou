<template>
  <search>
    <template #title>
      <title-card
        :title="$t('dataset.pageTitle')"
        icon="mdi-database-outline"
        class="title-dataset"
      />
    </template>

    <template #form>
      <search-form-dataset />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <data-table-dataset
        :show-search="false"
        :items="items"
        :count="count"
        :options="options"
        stateful-headers
        dynamic-headers
        @update="handleUpdate"
      />
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DataTableDataset from '~/components/data-table/DataTableDataset'
import SearchFormDataset from '~/components/search/forms/SearchFormDataset'
import Search from '~/templates/Search'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    SearchFormDataset,
    DataTableDataset,
    TitleCard,
  },
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
    ...mapState('search/dataset', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/dataset', ['searchDatasets']),
    async handleUpdate(tableState) {
      await this.searchDatasets(tableState?.options)
    },
  },
}
</script>
