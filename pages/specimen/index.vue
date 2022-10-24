<template>
  <search>
    <template #title>
      <base-header
        :title="$t('specimen.pageTitle')"
        :icon="icons.mdiMicroscope"
      />
    </template>

    <template #form>
      <search-form-specimen />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-specimen
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
import { mdiMicroscope } from '@mdi/js'
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import SearchFormSpecimen from '~/components/search/forms/SearchFormSpecimen.vue'
import DataTableSpecimen from '~/components/data-table/DataTableSpecimen.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    SearchFormSpecimen,
    DataTableSpecimen,
    BaseHeader,
  },
  async fetch() {
    await this.searchSpecimens(this.options)
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
    ...mapState('search/specimen', ['items', 'count']),
    ...mapFields('search/specimen', ['options']),
    icons() {
      return {
        mdiMicroscope,
      }
    },
  },
  methods: {
    ...mapActions('search/specimen', ['searchSpecimens']),
    handleUpdate(tableState) {
      this.options = tableState.options
      this.$fetch()
    },
  },
}
</script>
