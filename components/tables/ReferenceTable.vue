<template>
  <table-wrapper
    v-bind="{ showSearch, externalOptions }"
    :headers="headers"
    :items="items"
    :init-options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.reference="{ item }">
      <a class="text-link" @click="$openGeology('reference', item.id)">
        {{ item.reference }}
        <v-icon color="deep-orange darken-2" small>mdi-open-in-new</v-icon>
      </a>
    </template>

    <template #item.journal="{ item }">
      <div v-if="item.journal__journal_name">
        {{ item.journal__journal_name }}
      </div>
      <div v-else-if="item.book">{{ item.book }}</div>
    </template>

    <template #item.doi="{ item }">
      <a
        v-if="item.doi"
        class="text-link"
        @click="$openWindow(`https://doi.org/${item.doi}`)"
      >
        {{ item.doi }}
        <v-icon color="deep-orange darken-2" small>mdi-open-in-new</v-icon>
      </a>
    </template>
  </table-wrapper>
</template>

<script>
import TableWrapper from '@/components/tables/TableWrapper.vue'
export default {
  name: 'ReferenceTable',
  components: { TableWrapper },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    externalOptions: {
      type: Boolean,
      default: false,
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
        { text: this.$t('reference.id'), value: 'id' },
        { text: this.$t('reference.reference'), value: 'reference' },
        { text: this.$t('reference.author'), value: 'author' },
        { text: this.$t('reference.year'), value: 'year' },
        { text: this.$t('reference.title'), value: 'title' },
        { text: this.$t('reference.journalBook'), value: 'journal' },
        { text: this.$t('reference.pages'), value: 'pages' },
        { text: this.$t('reference.doi'), value: 'doi' },
        { text: this.$t('reference.remarks'), value: 'remarks' },
      ],
    }
  },
}
</script>
