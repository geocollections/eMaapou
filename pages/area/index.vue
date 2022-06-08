<template>
  <search>
    <template #title>
      <base-header
        :title="$t('area.pageTitle')"
        icon="mdi-map-marker-radius-outline"
      />
    </template>

    <template #form>
      <search-form-area />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <data-table-area
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
import SearchFormArea from '~/components/search/forms/SearchFormArea.vue'
import DataTableArea from '~/components/data-table/DataTableArea.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    DataTableArea,
    SearchFormArea,
    BaseHeader,
  },
  head() {
    return {
      title: this.$t('area.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('area.pageTitle'),
        },
      ],
    }
  },
  computed: {
    ...mapState('search/area', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/area', ['searchAreas']),
    handleUpdate(tableState) {
      this.searchAreas(tableState?.options)
    },
  },
}
</script>
