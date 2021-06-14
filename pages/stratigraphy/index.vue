<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.stratigraphy')"
        icon="mdi-layers-triple"
        class="title-stratigraphy"
      />
    </template>

    <template #form>
      <stratigraphy-search-form />
    </template>

    <template #result>
      <div class="text-h6 pl-2 py-1">
        {{ count ? $tc('common.count', count) : '' }}
      </div>
      <stratigraphy-table
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
import StratigraphySearchForm from '@/components/search/forms/StratigraphySearchForm.vue'
import StratigraphyTable from '@/components/tables/StratigraphyTable'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    StratigraphySearchForm,
    StratigraphyTable,
    TitleCard,
  },
  mixins: [dynamicTableHeaders],
  head() {
    return {
      title: this.$t('stratigraphy.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('stratigraphy.pageTitle'),
        },
      ],
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('stratigraphy', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('stratigraphy', ['searchStratigraphy']),
    async handleUpdate(tableState) {
      await this.searchStratigraphy(tableState?.options)
    },
  },
}
</script>
