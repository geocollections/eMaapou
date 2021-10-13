<template>
  <search>
    <template #title>
      <title-card
        :title="$t('taxon.pageTitle')"
        :subtitle="$t('common.count', { count: count })"
        icon="mdi-family-tree"
        class="title-main"
      />
    </template>

    <template #form>
      <taxon-search-form />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <taxon-table
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
import Search from '@/components/templates/Search'
import TaxonSearchForm from '@/components/search/forms/TaxonSearchForm.vue'
import TaxonTable from '@/components/tables/TaxonTable'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    TaxonSearchForm,
    TaxonTable,
    TitleCard,
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
