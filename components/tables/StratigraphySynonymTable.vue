<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.language="{ item }">
      <div v-if="item.language">
        {{
          $translate({ et: item.language.value, en: item.language.value_en })
        }}
      </div>
    </template>
    <template #item.reference="{ item }">
      <external-link
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </external-link>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import ExternalLink from '~/components/ExternalLink'
export default {
  name: 'StratigraphySynonymTable',
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
        { text: this.$t('stratigraphySynonym.synonym'), value: 'synonym' },
        { text: this.$t('stratigraphySynonym.language'), value: 'language' },
        {
          text: this.$t('stratigraphySynonym.reference'),
          value: 'reference',
        },
        { text: this.$t('stratigraphySynonym.remarks'), value: 'remarks' },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
