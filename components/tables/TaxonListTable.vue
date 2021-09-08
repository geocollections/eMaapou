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
      <external-link
        v-if="item.taxon"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon.id}`)"
      >
        {{ item.taxon.taxon }}
      </external-link>
    </template>

    <template #item.agent="{ item }">
      <div v-if="item.agent_identified">
        {{ item.agent_identified.agent }}
      </div>
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
import ExternalLink from '~/components/ExternalLink'
export default {
  name: 'TaxonListTable',
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
        { text: this.$t('taxon.taxon'), value: 'taxon' },
        {
          text: this.$t('taxon.name'),
          value: 'name',
        },
        { text: this.$t('taxon.frequency'), value: 'frequency' },
        {
          text: this.$t('taxon.agent_identified'),
          value: 'agent',
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
