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
        v-if="item.id"
        @click.native="$openWindow(`https://fossiilid.info/${item.id}`)"
      >
        {{ item.taxon }}
      </external-link>
    </template>

    <template #item.fossil_group="{ item }">
      <external-link
        v-if="item.fossil_group_id"
        @click.native="
          $openWindow(`https://fossiilid.info/${item.fossil_group_id}`)
        "
      >
        {{ item.fossil_group }}
      </external-link>
      <div v-else>{{ item.fossil_group }}</div>
    </template>

    <template #item.parent_taxon="{ item }">
      <external-link
        v-if="item.parent_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.parent_id}`)"
      >
        {{ item.parent_taxon }}
      </external-link>
      <div v-else>{{ item.parent_taxon }}</div>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import ExternalLink from '~/components/ExternalLink'
export default {
  name: 'TaxonTable',
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
        { text: this.$t('taxon.id'), value: 'id' },
        { text: this.$t('taxon.taxon'), value: 'taxon' },
        {
          text: this.$t('taxon.authorYear'),
          value: 'author_year',
        },
        { text: this.$t('taxon.parentTaxon'), value: 'parent_taxon' },
        {
          text: this.$t('taxon.fossilGroup'),
          value: 'fossil_group',
        },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
