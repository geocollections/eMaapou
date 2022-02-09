<template>
  <search>
    <template #title>
      <title-card
        :title="$t('preparation.pageTitle')"
        class="title-preparation"
      />
    </template>

    <template #form>
      <preparation-search-form />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <data-table-preparation
        :show-search="false"
        :items="items"
        :count="count"
        :options="options"
        stateful-headers
        dynamic-headers
        @update="handleUpdate"
      />
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DataTablePreparation from '~/components/data-table/DataTablePreparation.vue'
import PreparationSearchForm from '~/components/search/forms/PreparationSearchForm.vue'
import Search from '~/templates/Search.vue'
import TitleCard from '~/components/TitleCard.vue'

export default {
  name: 'PreparationSearch',
  components: {
    Search,
    PreparationSearchForm,
    DataTablePreparation,
    TitleCard,
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
