<template>
  <search>
    <template #title>
      <title-card
        :title="$t('drillcore.pageTitle')"
        icon="mdi-screw-machine-flat-top"
        class="title-drillcore"
      />
    </template>

    <template #form>
      <drillcore-search-form />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <drillcore-table
        :show-search="false"
        :items="items"
        :count="count"
        :options="options"
        dynamic-headers
        stateful-headers
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
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    DrillcoreSearchForm,
    DrillcoreTable,
    TitleCard,
  },
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
