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
      <preparation-table
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
import PreparationTable from '~/components/tables/PreparationTable.vue'
import PreparationSearchForm from '~/components/search/forms/PreparationSearchForm.vue'
import Search from '~/components/templates/Search.vue'
import TitleCard from '~/components/TitleCard.vue'

export default {
  name: 'PreparationSearch',
  components: {
    Search,
    PreparationSearchForm,
    PreparationTable,
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
