<template>
  <search>
    <template #title>
      <base-header
        :title="$t('locality.pageTitle')"
        icon="mdi-map-marker-outline"
      />
    </template>

    <template #form>
      <search-form-locality />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <data-table-locality
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
import SearchFormLocality from '~/components/search/forms/SearchFormLocality'
import DataTableLocality from '~/components/data-table/DataTableLocality.vue'
import Search from '~/templates/Search'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    DataTableLocality,
    SearchFormLocality,
    BaseHeader,
  },
  head() {
    return {
      title: this.$t('locality.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('locality.pageTitle'),
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
    ...mapState('search/locality', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/locality', ['searchLocalities']),
    handleUpdate(tableState) {
      this.searchLocalities(tableState?.options)
    },
  },
}
</script>
