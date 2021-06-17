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
      <div class="text-h6 pl-2 py-1">
        {{ count ? $tc('common.count', count) : '' }}
      </div>
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
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    TaxonSearchForm,
    TaxonTable,
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
