<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.drillcoresCount')"
        :subtitle="$t('common.count', { count: count })"
        icon="mdi-screw-machine-flat-top"
        class="title-drillcore"
      />
    </template>

    <template #form>
      <drillcore-search-form />
    </template>

    <template #result>
      <search-view-map-wrapper
        borehole-overlay
        :items="items"
        class="mb-6"
        @update="handleUpdate"
      />

      <drillcore-table
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
import DrillcoreSearchForm from '@/components/search/forms/DrillcoreSearchForm'
import DrillcoreTable from '~/components/tables/DrillcoreTable.vue'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import Search from '~/components/templates/Search'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    SearchViewMapWrapper,
    DrillcoreSearchForm,
    DrillcoreTable,
    TitleCard,
  },
  mixins: [dynamicTableHeaders],
  head() {
    return {
      title: this.$t('drillcore.pageTitle'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('drillcore.pageTitle'),
        },
      ],
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('drillcore', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('drillcore', ['searchDrillcores']),
    async handleUpdate(tableState) {
      await this.searchDrillcores(tableState?.options)
    },
  },
}
</script>
