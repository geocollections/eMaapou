<template>
  <search>
    <template #title>
      <base-header
        :title="$t('drillcore.pageTitle')"
        :icon="icons.mdiScrewMachineFlatTop"
      />
    </template>

    <template #form>
      <search-form-drillcore />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <v-card>
        <data-table-drillcore
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          :flat="false"
          dynamic-headers
          stateful-headers
          :is-loading="$fetchState.pending"
          @update="handleUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script>
import { mdiScrewMachineFlatTop } from '@mdi/js'
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import SearchFormDrillcore from '~/components/search/forms/SearchFormDrillcore.vue'
import DataTableDrillcore from '~/components/data-table/DataTableDrillcore.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    SearchFormDrillcore,
    DataTableDrillcore,
    BaseHeader,
  },
  async fetch() {
    await this.searchDrillcores(this.options)
  },
  head() {
    return {
      title: this.$t('drillcore.pageTitle'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('drillcore.pageTitle'),
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
    ...mapState('search/drillcore', ['items', 'count']),
    ...mapFields('search/drillcore', ['options']),
    icons() {
      return {
        mdiScrewMachineFlatTop,
      }
    },
  },
  methods: {
    ...mapActions('search/drillcore', ['searchDrillcores']),
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
