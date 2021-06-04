<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.samplesCount')"
        :subtitle="$t('common.count', { count: count })"
        icon="mdi-test-tube"
        class="title-sample"
      />
    </template>

    <template #form>
      <sample-search-form />
    </template>

    <template #result>
      <search-view-map-wrapper
        sample-overlay
        :items="items"
        class="mb-6"
        @update="handleUpdate"
      />

      <sample-table
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
import SampleSearchForm from '@/components/search/forms/SampleSearchForm'
import SampleTable from '~/components/tables/SampleTable.vue'
import SearchViewMapWrapper from '~/components/map/SearchViewMapWrapper'
import Search from '~/components/templates/Search'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    SearchViewMapWrapper,
    SampleSearchForm,
    SampleTable,
    TitleCard,
  },
  mixins: [dynamicTableHeaders],
  head() {
    return {
      title: this.$t('sample.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('sample.pageTitle'),
        },
      ],
    }
  },
  computed: {
    ...mapState('landing', ['search']),
    ...mapState('sample', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('sample', ['searchSamples']),
    async handleUpdate(tableState) {
      await this.searchSamples(tableState?.options)
    },
  },
}
</script>
