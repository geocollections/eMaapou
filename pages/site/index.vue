<template>
  <search>
    <template #title>
      <base-header
        :title="$t('site.pageTitle')"
        :icon="icons.mdiMapMarkerStarOutline"
      />
    </template>

    <template #form>
      <search-form-site />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-site
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
import { mdiMapMarkerStarOutline } from '@mdi/js'
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import SearchFormSite from '~/components/search/forms/SearchFormSite.vue'
import DataTableSite from '~/components/data-table/DataTableSite.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    SearchFormSite,
    DataTableSite,
    BaseHeader,
  },
  async fetch() {
    await this.searchSites(this.options)
  },
  head() {
    return {
      title: this.$t('site.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('site.pageTitle'),
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
    ...mapState('search/site', ['items', 'count']),
    ...mapFields('search/site', ['options']),
    icons() {
      return {
        mdiMapMarkerStarOutline,
      }
    },
    translatedHeaders() {
      return this.headers.map((header) => {
        return {
          ...header,
          text: this.$t(header.text),
        }
      })
    },
  },
  methods: {
    ...mapActions('search/site', ['searchSites']),
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
