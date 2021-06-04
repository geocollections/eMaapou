<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.localitiesCount')"
        :subtitle="$t('common.count', { count: count })"
        icon="mdi-map-marker-outline"
        class="title-locality"
      />
    </template>

    <template #form>
      <locality-search-form />
    </template>

    <template #result>
      <search-view-map-wrapper
        locality-overlay
        :items="items"
        class="mb-6"
        @update="handleUpdate"
      />
      <locality-table
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
import LocalitySearchForm from '@/components/search/forms/LocalitySearchForm'
import LocalityTable from '~/components/tables/LocalityTable.vue'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import Search from '~/components/templates/Search'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    SearchViewMapWrapper,
    LocalityTable,
    LocalitySearchForm,
    TitleCard,
  },
  mixins: [dynamicTableHeaders],
  head() {
    return {
      title: this.$t('locality.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('locality.pageTitle'),
        },
      ],
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('locality', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('locality', ['searchLocalities']),
    async handleUpdate(tableState) {
      await this.searchLocalities(tableState?.options)
    },
  },
}
</script>
