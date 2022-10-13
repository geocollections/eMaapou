<template>
  <search>
    <template #title>
      <base-header
        :title="$t('taxon.pageTitle')"
        :subtitle="$t('common.count', { count: count })"
        icon="mdi-family-tree"
      />
    </template>

    <template #form>
      <search-form-taxon />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-taxon
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
import Search from '~/templates/Search.vue'
import SearchFormTaxon from '~/components/search/forms/SearchFormTaxon.vue'
import DataTableTaxon from '~/components/data-table/DataTableTaxon.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    SearchFormTaxon,
    DataTableTaxon,
    BaseHeader,
  },
  async fetch() {
    await this.searchTaxa(this.options)
  },
  head() {
    return {
      title: this.$t('taxon.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('taxon.pageTitle'),
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
        },
      ],
    }
  },
  computed: {
    ...mapState('search/taxon', ['items', 'count']),
    ...mapFields('search/taxon', ['options']),
  },
  methods: {
    ...mapActions('search/taxon', ['searchTaxa']),
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
