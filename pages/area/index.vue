<template>
  <search>
    <template #title>
      <base-header
        :title="$t('area.pageTitle')"
        :icon="icons.mdiMapMarkerRadiusOutline"
      />
    </template>

    <template #form>
      <search-form-area />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-area
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
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
import { mdiMapMarkerRadiusOutline } from '@mdi/js'
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
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
  async fetch() {
    await this.searchAreas(this.options)
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
    ...mapState('search/area', ['items', 'count']),
    ...mapFields('search/area', ['options']),
    icons() {
      return {
        mdiMapMarkerRadiusOutline,
      }
    },
  },
  methods: {
    ...mapActions('search/area', ['searchAreas']),
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
