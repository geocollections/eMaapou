<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.drillcoresCount')"
        icon="mdi-screw-machine-flat-top"
        class="title-drillcore"
      />
    </template>

    <template #form>
      <drillcore-search-form />
      <!-- <search-view-map-wrapper
        borehole-overlay
        :items="items"
        class="mb-6 mt-2"
        @update="handleUpdate"
      /> -->
    </template>

    <template #result>
      <div class="text-h6 pl-2 py-1">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
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
import DrillcoreSearchForm from '@/components/search/forms/DrillcoreSearchForm.vue'
import DrillcoreTable from '~/components/tables/DrillcoreTable.vue'
import Search from '~/components/templates/Search.vue'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
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
    ...mapState('search/drillcore', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/drillcore', ['searchDrillcores']),
    handleUpdate(tableState) {
      this.searchDrillcores(tableState?.options)
    },
  },
}
</script>
