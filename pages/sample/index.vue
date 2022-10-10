<template>
  <search>
    <template #title>
      <base-header :title="$t('sample.pageTitle')" icon="mdi-test-tube" />
    </template>

    <template #form>
      <search-form-sample />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-sample
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          dynamic-headers
          stateful-headers
          @update="handleUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchFormSample from '~/components/search/forms/SearchFormSample.vue'
import DataTableSample from '~/components/data-table/DataTableSample.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    SearchFormSample,
    DataTableSample,
    BaseHeader,
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
