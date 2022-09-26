<template>
  <search>
    <template #title>
      <base-header :title="$t('preparation.pageTitle')" icon="mdi-eyedropper" />
    </template>

    <template #form>
      <search-form-preparation />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>

      <v-card>
        <data-table-preparation
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
import DataTablePreparation from '~/components/data-table/DataTablePreparation.vue'
import SearchFormPreparation from '~/components/search/forms/SearchFormPreparation.vue'
import Search from '~/templates/Search.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'

export default {
  name: 'PreparationSearch',
  components: {
    Search,
    SearchFormPreparation,
    DataTablePreparation,
    BaseHeader,
  },
  head() {
    return {
      title: this.$t('preparation.pageTitle'),
      meta: [
        {
          property: 'og:title',
          content: this.$t('preparation.pageTitle'),
          hid: 'og:title',
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
    ...mapState('search/preparation', ['items', 'count', 'options']),
  },
  methods: {
    ...mapActions('search/preparation', ['searchPreparations']),
    async handleUpdate(tableState) {
      await this.searchPreparations(tableState?.options)
    },
  },
}
</script>
