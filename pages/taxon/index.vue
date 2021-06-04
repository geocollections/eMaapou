<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.taxa')"
        :subtitle="$t('common.count', { count: count })"
        icon="mdi-layers-triple"
        class="title-main"
      />
    </template>

    <template #form>
      <taxon-search-form />
    </template>

    <template #result>
      <search-view-map-wrapper
        locality-overlay
        :items="items"
        class="mb-6"
        @update="handleUpdate"
      />
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
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    TaxonSearchForm,
    TaxonTable,
    SearchViewMapWrapper,
    TitleCard,
  },
  mixins: [dynamicTableHeaders],
  head() {
    return {
      title: this.$t('taxon.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('taxon.pageTitle'),
        },
      ],
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('taxon', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('taxon', ['searchTaxa']),
    async handleUpdate(tableState) {
      await this.searchTaxa(tableState?.options)
    },
  },
}
</script>
