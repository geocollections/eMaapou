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
          :items="$accessor.search.dataset.items"
          :count="$accessor.search.dataset.count"
          :options="$accessor.search.dataset.options"
          stateful-headers
          dynamic-headers
          :is-loading="$fetchState.pending"
          @update="handleUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script lang="ts">
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import DataTableDataset from '~/components/data-table/DataTableDataset.vue'
import SearchFormDataset from '~/components/search/forms/SearchFormDataset.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
export default Vue.extend({
  components: {
    Search,
    SearchFormDataset,
    DataTableDataset,
    BaseHeader,
  },
  async fetch() {
    await this.$accessor.search.dataset.searchDatasets(this.options)
    // await this.searchDatasets(this.options)
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
    } as MetaInfo
  },
  computed: {
    ...mapState('search/dataset', ['options', 'items', 'count']),
    ...mapState('settings', ['cookiePolicy']),
    ...mapFields('search/dataset', ['options']),
  },
  methods: {
    ...mapActions('search/dataset', ['searchDatasets']),
    handleUpdate(tableState: any) {
      this.options = tableState.options
      this.$fetch()
    },
  },
})
</script>
