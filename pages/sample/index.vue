<template>
  <search>
    <template #title>
      <title-card
        :title="$t('sample.pageTitle')"
        icon="mdi-test-tube"
        class="title-sample"
      />
    </template>

    <template #form>
      <search-form-sample />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <data-table-sample
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
import SearchFormSample from '~/components/search/forms/SearchFormSample.vue'
import DataTableSample from '~/components/data-table/DataTableSample.vue'
import Search from '~/templates/Search'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    SearchFormSample,
    DataTableSample,
    TitleCard,
  },
  head() {
    return {
      title: this.$t('sample.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('sample.pageTitle'),
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
