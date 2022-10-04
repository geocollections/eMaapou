<template>
  <search>
    <template #title>
      <base-header
        :title="$t('stratigraphy.pageTitle')"
        icon="mdi-layers-triple"
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
          @update="handleUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Search from '~/templates/Search'
import SearchFormStratigraphy from '~/components/search/forms/SearchFormStratigraphy.vue'
import DataTableStratigraphy from '~/components/data-table/DataTableStratigraphy'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  components: {
    Search,
    SearchFormStratigraphy,
    DataTableStratigraphy,
    BaseHeader,
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
    ...mapState('search/stratigraphy', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/stratigraphy', ['searchStratigraphies']),
    async handleUpdate(tableState) {
      await this.searchStratigraphies(tableState?.options)
    },
  },
}
</script>
