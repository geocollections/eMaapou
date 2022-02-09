<template>
  <search>
    <template #title>
      <title-card
        :title="$t('stratigraphy.pageTitle')"
        icon="mdi-layers-triple"
        class="title-stratigraphy"
      />
    </template>

    <template #form>
      <stratigraphy-search-form />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <data-table-stratigraphy
        :show-search="false"
        :items="items"
        :count="count"
        :options="options"
        dynamic-headers
        stateful-headers
        @update="handleUpdate"
      />
    </template>
  </search>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Search from '~/templates/Search'
import StratigraphySearchForm from '~/components/search/forms/StratigraphySearchForm.vue'
import DataTableStratigraphy from '~/components/data-table/DataTableStratigraphy'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    StratigraphySearchForm,
    DataTableStratigraphy,
    TitleCard,
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
