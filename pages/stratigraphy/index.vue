<template>
  <search>
    <template #title>
      <base-header
        :title="$t('stratigraphy.pageTitle')"
        :icon="icons.mdiLayersTriple"
      />
    </template>

    <template #form>
      <search-form-stratigraphy />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-stratigraphy
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
import { mdiLayersTriple } from '@mdi/js'
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import Search from '~/templates/Search.vue'
import SearchFormStratigraphy from '~/components/search/forms/SearchFormStratigraphy.vue'
import DataTableStratigraphy from '~/components/data-table/DataTableStratigraphy.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    SearchFormStratigraphy,
    DataTableStratigraphy,
    BaseHeader,
  },
  async fetch() {
    await this.searchStratigraphies(this.options)
  },
  head() {
    return {
      title: this.$t('stratigraphy.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('stratigraphy.pageTitle'),
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
    ...mapState('search/stratigraphy', ['items', 'count']),
    ...mapFields('search/stratigraphy', ['options']),
    icons() {
      return {
        mdiLayersTriple,
      }
    },
  },
  methods: {
    ...mapActions('search/stratigraphy', ['searchStratigraphies']),
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
