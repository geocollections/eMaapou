<template>
  <search>
    <template #title>
      <title-card
        :title="$t('site.pageTitle')"
        icon="mdi-map-marker-star-outline"
        class="title-site"
      />
    </template>

    <template #form>
      <search-form-site />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <data-table-site
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
import SearchFormSite from '~/components/search/forms/SearchFormSite'
import DataTableSite from '~/components/data-table/DataTableSite.vue'
import Search from '~/templates/Search'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    SearchFormSite,
    DataTableSite,
    TitleCard,
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
    ...mapState('search/site', ['options', 'items', 'count']),
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
    async handleUpdate(tableState) {
      await this.searchSites(tableState?.options)
    },
  },
}
</script>
