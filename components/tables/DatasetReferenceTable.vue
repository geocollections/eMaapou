<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.reference="{ item }">
      <external-link
        v-if="item.reference__id"
        @click.native="$openGeology('reference', item.reference__id)"
      >
        {{ item.reference__reference }}
      </external-link>
    </template>
    <template #item.title="{ item }">
      <div>{{ item.reference__title }}</div>
    </template>

    <template #item.journal="{ item }">
      <div v-if="item.reference__journal__journal_name">
        {{ item.reference__journal__journal_name }}
      </div>
      <div v-else-if="item.book">{{ item.reference__book }}</div>
    </template>
    <template #item.pages="{ item }">
      <div>
        {{ item.reference__pages }}
      </div>
    </template>
  </table-wrapper>
</template>

<script>
import TableWrapper from '@/components/tables/TableWrapper.vue'
import ExternalLink from '~/components/ExternalLink'
export default {
  name: 'DatasetReferenceTable',
  components: { ExternalLink, TableWrapper },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    items: {
      type: Array,
      default: () => [],
    },
    count: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: () => ({
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      }),
    },
  },
  data() {
    return {
      headers: [
        { text: this.$t('reference.reference'), value: 'reference' },
        { text: this.$t('reference.title'), value: 'title' },
        { text: this.$t('reference.journalBook'), value: 'journal' },
        { text: this.$t('reference.pages'), value: 'pages' },
      ],
    }
  },
}
</script>
