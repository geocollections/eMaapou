<template>
  <search>
    <template #title>
      <page-title-wrapper
        :title="$t('common.taxa')"
        :count="count"
        icon="mdi-layers-triple"
      />
    </template>

    <template #form>
      <taxon-search-form />
    </template>

    <template #result>
      <taxon-table
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
import Search from '@/components/templates/Search'
import TaxonSearchForm from '@/components/search/forms/TaxonSearchForm.vue'
import TaxonTable from '@/components/tables/TaxonTable'
import PageTitleWrapper from '@/components/search/PageTitleWrapper'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'
export default {
  components: {
    Search,
    TaxonSearchForm,
    TaxonTable,
    PageTitleWrapper,
  },
  mixins: [dynamicTableHeaders],
  head() {
    return {
      title: this.$t('taxon.pageTitle'),
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('taxon', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('taxon', ['searchTaxa']),
    async handleUpdate(tableState) {
      await this.searchTaxa(tableState.options)
    },
  },
}
</script>
