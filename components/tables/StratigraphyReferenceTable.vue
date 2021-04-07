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
      <outer-link
        class="text-link"
        :value="item.reference__reference"
        @click.native="$openGeology('reference', item.reference__id)"
      ></outer-link>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import OuterLink from '../OuterLink.vue'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'StratigraphyReferenceTable',
  components: { TableWrapper, OuterLink },
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
