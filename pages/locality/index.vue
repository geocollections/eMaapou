<template>
  <search>
    <template #title>
      <title-card
        :title="$t('locality.pageTitle')"
        icon="mdi-map-marker-outline"
        class="title-locality"
      />
    </template>

    <template #form>
      <locality-search-form />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <data-table-locality
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
import LocalitySearchForm from '~/components/search/forms/LocalitySearchForm'
import DataTableLocality from '~/components/data-table/DataTableLocality.vue'
import Search from '~/templates/Search'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    DataTableLocality,
    LocalitySearchForm,
    TitleCard,
  },
  head() {
    return {
      title: this.$t('locality.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('locality.pageTitle'),
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
    ...mapState('search/locality', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/locality', ['searchLocalities']),
    handleUpdate(tableState) {
      this.searchLocalities(tableState?.options)
    },
  },
}
</script>
