<template>
  <search>
    <template #title>
      <base-header
        :title="$t('taxon.pageTitle')"
        :subtitle="$t('common.count', { count: count })"
        icon="mdi-family-tree"
        class="title-main"
      />
    </template>

    <template #form>
      <search-form-taxon />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <data-table-taxon
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
import Search from '~/templates/Search'
import SearchFormTaxon from '~/components/search/forms/SearchFormTaxon.vue'
import DataTableTaxon from '~/components/data-table/DataTableTaxon'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    SearchFormTaxon,
    DataTableTaxon,
    BaseHeader,
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
    ...mapState('search/taxon', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/taxon', ['searchTaxa']),
    async handleUpdate(tableState) {
      await this.searchTaxa(tableState?.options)
    },
  },
}
</script>
