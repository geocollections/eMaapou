<template>
  <search>
    <template #title>
      <title-card
        :title="$t('common.specimenCount')"
        icon="mdi-microscope"
        class="title-specimen"
      />
    </template>

    <template #form>
      <specimen-search-form />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <specimen-table
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
import SpecimenSearchForm from '~/components/search/forms/SpecimenSearchForm.vue'
import SpecimenTable from '~/components/tables/SpecimenTable.vue'
import Search from '~/components/templates/Search'
import dynamicTableHeaders from '~/mixins/dynamicTableHeaders'
import TitleCard from '~/components/TitleCard.vue'

export default {
  components: {
    Search,
    SpecimenSearchForm,
    SpecimenTable,
    TitleCard,
  },
  mixins: [dynamicTableHeaders],
  head() {
    return {
      title: this.$t('specimen.pageTitle'),
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('specimen.pageTitle'),
        },
      ],
    }
  },
  computed: {
    ...mapState('search/specimen', ['options', 'items', 'count']),
  },
  methods: {
    ...mapActions('search/specimen', ['searchSpecimens']),
    handleUpdate(tableState) {
      this.searchSpecimens(tableState?.options)
    },
  },
}
</script>
