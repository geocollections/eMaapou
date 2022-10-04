<template>
  <search>
    <template #title>
      <base-header
        :title="$t('dataset.pageTitle')"
        icon="mdi-database-outline"
      />
    </template>

    <template #form>
      <search-form-dataset />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-dataset
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          stateful-headers
          dynamic-headers
          @update="handleUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  head() {
    return {
      title: this.$t('dataset.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('dataset.pageTitle'),
        },
      ],
    }
  },
  computed: {
    ...mapState('search/dataset', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/dataset', ['searchDatasets']),
    async handleUpdate(tableState) {
      await this.searchDatasets(tableState?.options)
    },
  },
}
</script>
