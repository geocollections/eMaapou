<template>
  <search>
    <template #title>
      <title-card :title="$t('area.pageTitle')" class="title-area" />
    </template>

    <template #form>
      <area-search-form />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <data-table-area
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
import AreaSearchForm from '~/components/search/forms/AreaSearchForm.vue'
import DataTableArea from '~/components/data-table/DataTableArea.vue'
import Search from '~/templates/Search.vue'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    DataTableArea,
    AreaSearchForm,
    TitleCard,
  },
  head() {
    return {
      title: this.$t('area.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('area.pageTitle'),
        },
      ],
    }
  },
  computed: {
    ...mapState('search/area', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/area', ['searchAreas']),
    handleUpdate(tableState) {
      this.searchAreas(tableState?.options)
    },
  },
}
</script>
