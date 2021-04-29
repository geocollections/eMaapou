<template>
  <search>
    <template #title>
      <page-title-wrapper
        :title="$t('common.samplesCount')"
        :count="count"
        icon="mdi-test-tube"
      />
    </template>

    <template #form>
      <sample-search-form />
    </template>

    <template #result>
      <search-view-map-wrapper :items="items" class="mb-6" />

      <sample-table
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
import SampleSearchForm from '@/components/search/forms/SampleSearchForm'
import SampleTable from '~/components/tables/SampleTable.vue'
import PageTitleWrapper from '~/components/search/PageTitleWrapper'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import Search from '~/components/templates/Search'

export default {
  components: {
    Search,
    SearchViewMapWrapper,
    PageTitleWrapper,
    SampleSearchForm,
    SampleTable,
  },
  head() {
    return {
      title: this.$t('sample.pageTitle'),
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('sample', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('sample', ['searchSamples']),
    async handleUpdate(tableState) {
      await this.searchSamples(tableState.options)
    },
  },
}
</script>
