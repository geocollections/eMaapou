<template>
  <search>
    <template #title>
      <page-title-wrapper
        :title="$t('common.stratigraphy')"
        :count="count"
        icon="mdi-layers-triple"
      />
    </template>

    <template #form>
      <stratigraphy-search-form />
    </template>

    <template #result>
      <stratigraphy-table
        :show-search="false"
        :items="items"
        :count="count"
        :options="options"
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
import PageTitleWrapper from '@/components/search/PageTitleWrapper'
export default {
  components: {
    Search,
    StratigraphySearchForm,
    StratigraphyTable,
    PageTitleWrapper,
  },
  head() {
    return {
      title: this.$t('stratigraphy.pageTitle'),
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('stratigraphy', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('stratigraphy', ['searchStratigraphy']),
    async handleUpdate(tableState) {
      await this.searchStratigraphy(tableState.options)
    },
  },
}
</script>
