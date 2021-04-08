<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.taxon="{ item }">
      <a
        class="text-link"
        @click="$openWindow(`https://fossiilid.info/${item.taxon}`)"
      >
        {{ item.taxon__taxon }}
      </a>
    </template>

    <template #item.extra="{ item }">
      <v-icon v-if="item.extra">mdi-plus</v-icon>
      <v-icon v-else>mdi-minus</v-icon>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'TaxonListTable',
  components: { TableWrapper },
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
        { text: this.$t('taxon.taxon'), value: 'taxon' },
        {
          text: this.$t('taxon.name'),
          value: 'name',
        },
        { text: this.$t('taxon.frequency'), value: 'frequency' },
        {
          text: this.$t('taxon.agent_identified'),
          value: 'agent_identified__agent',
        },
        { text: this.$t('taxon.date_identified'), value: 'date_identified' },
        { text: this.$t('taxon.extra'), value: 'extra' },
        { text: this.$t('taxon.remarks'), value: 'remarks' },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
