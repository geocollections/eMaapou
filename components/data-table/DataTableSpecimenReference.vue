<template>
  <base-data-table
    v-bind="$attrs"
    :headers="$_headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="$_handleHeadersChange"
    @reset:headers="$_handleHeadersReset"
  >
    <template #item.reference="{ item }">
      <external-link
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </external-link>
    </template>
  </base-data-table>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import ExternalLink from '~/components/ExternalLink.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_SPECIMEN_REFERENCE } from '~/constants'
export default {
  name: 'DataTableSpecimenReference',
  components: { BaseDataTable, ExternalLink },
  mixins: [headersMixin],
  props: {
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
      localHeaders: cloneDeep(HEADERS_SPECIMEN_REFERENCE),
    }
  },
  methods: {
    round,
  },
}
</script>
