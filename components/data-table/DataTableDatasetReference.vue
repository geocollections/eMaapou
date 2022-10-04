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
      <base-link-external
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </base-link-external>
    </template>
    <template #item.title="{ item }">
      <div v-if="item.reference">{{ item.reference.title }}</div>
    </template>

    <template #item.journal="{ item }">
      <div v-if="item.reference && item.reference.journal">
        {{ item.reference.journal.journal_name }}
      </div>
      <div v-else-if="item.reference.book">{{ item.reference.book }}</div>
    </template>
    <template #item.pages="{ item }">
      <div v-if="item.reference">
        {{ item.reference.pages }}
      </div>
    </template>
  </base-data-table>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_DATASET_REFERENCE } from '~/constants'
export default {
  name: 'DataTableDatasetReference',
  components: { BaseLinkExternal, BaseDataTable },
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
      localHeaders: cloneDeep(HEADERS_DATASET_REFERENCE),
    }
  },
}
</script>
