<template>
  <search>
    <template #title>
      <base-header
        :title="$t('dataset.pageTitle')"
        icon="mdi-database-outline"
      />
    </template>

    <template #form>
      <search-form-dataset />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-dataset
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          stateful-headers
          dynamic-headers
          :is-loading="$fetchState.pending"
          @update="handleUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import DataTableDataset from '~/components/data-table/DataTableDataset.vue'
import SearchFormDataset from '~/components/search/forms/SearchFormDataset.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    SearchFormDataset,
    DataTableDataset,
    BaseHeader,
  },
  async fetch() {
    await this.searchDatasets(this.options)
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
    ...mapFields('search/dataset', ['options']),
  },
  methods: {
    ...mapActions('search/dataset', ['searchDatasets']),
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
