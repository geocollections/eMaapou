<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.samplesCount')"
        icon="mdi-test-tube"
        class="title-sample"
      />
    </template>

    <template #form>
      <sample-search-form />
    </template>

    <template #result>
      <div class="text-h6 pl-2 py-1">
        {{ count ? $tc('common.count', count) : '' }}
      </div>
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
import SampleSearchForm from '@/components/search/forms/SampleSearchForm.vue'
import SampleTable from '~/components/tables/SampleTable.vue'
import Search from '~/components/templates/Search'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
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
    ...mapState('search/sample', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/sample', ['searchSamples']),
    handleUpdate(tableState) {
      this.searchSamples(tableState?.options)
    },
  },
}
</script>
