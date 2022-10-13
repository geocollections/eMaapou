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
      <v-card>
        <data-table-locality
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          dynamic-headers
          :is-loading="$fetchState.pending"
          stateful-headers
          @update="handleUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import SearchFormLocality from '~/components/search/forms/SearchFormLocality.vue'
import DataTableLocality from '~/components/data-table/DataTableLocality.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    DataTableLocality,
    SearchFormLocality,
    BaseHeader,
  },
  async fetch() {
    await this.searchLocalities(this.options)
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
    ...mapState('search/locality', ['items', 'count']),
    ...mapFields('search/locality', ['options']),
  },
  methods: {
    ...mapActions('search/locality', ['searchLocalities']),
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
