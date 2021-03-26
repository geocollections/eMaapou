<template>
  <table-wrapper
    v-bind="{ showSearch, externalOptions }"
    :headers="headers"
    :items="items"
    :init-options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.taxon="{ item }">
      <outer-link
        :value="item.taxon"
        @click.native="$openWindow(`https://fossiilid.info/${item.id}`)"
      />
    </template>

    <template #item.fossil_group="{ item }">
      <outer-link
        v-if="item.fossil_group_id"
        :value="item.fossil_group"
        @click.native="
          $openWindow(`https://fossiilid.info/${item.fossil_group_id}`)
        "
      />
      <div v-else>{{ item.fossil_group }}</div>
    </template>

    <template #item.parent_taxon="{ item }">
      <outer-link
        v-if="item.parent_id"
        :value="item.parent_taxon"
        @click.native="$openWindow(`https://fossiilid.info/${item.parent_id}`)"
      />
      <div v-else>{{ item.parent_taxon }}</div>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import OuterLink from '~/components/OuterLink'
export default {
  name: 'TaxonTable',
  components: { OuterLink, TableWrapper },
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
