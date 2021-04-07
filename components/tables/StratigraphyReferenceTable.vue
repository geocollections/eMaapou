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
      <external-link
        v-if="item.reference__id"
        @click.native="$openGeology('reference', item.reference__id)"
      >
        {{ item.reference__reference }}
      </external-link>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import ExternalLink from '../ExternalLink.vue'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'StratigraphyReferenceTable',
  components: { TableWrapper, ExternalLink },
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
        {
          text: this.$t('stratigraphyReference.reference'),
          value: 'reference',
        },
        { text: this.$t('stratigraphyReference.pages'), value: 'pages' },
        { text: this.$t('stratigraphyReference.remarks'), value: 'remarks' },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
