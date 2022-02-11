<template>
  <search>
    <template #title>
      <base-header :title="$t('specimen.pageTitle')" icon="mdi-microscope" />
    </template>

    <template #form>
      <search-form-specimen />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <data-table-specimen
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
import SearchFormSpecimen from '~/components/search/forms/SearchFormSpecimen.vue'
import DataTableSpecimen from '~/components/data-table/DataTableSpecimen.vue'
import Search from '~/templates/Search'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    SearchFormSpecimen,
    DataTableSpecimen,
    BaseHeader,
  },
  head() {
    return {
      title: this.$t('specimen.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('specimen.pageTitle'),
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
    ...mapState('search/specimen', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/specimen', ['searchSpecimens']),
    handleUpdate(tableState) {
      this.searchSpecimens(tableState?.options)
    },
  },
}
</script>
