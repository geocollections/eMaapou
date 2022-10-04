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
      <a
        v-if="item.reference"
        class="text-link"
        @click="$openGeology('reference', item.reference.id)"
        >{{ item.reference.id }}</a
      >
    </template>

    <template #item.reference__title="{ item }">
      <a
        v-if="item.reference"
        class="text-link"
        @click="$openGeology('reference', item.reference.id)"
        >{{ item.reference.reference }}</a
      >
    </template>
  </base-data-table>
</template>

<script>
import round from 'lodash/round'
import cloneDeep from 'lodash/cloneDeep'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_SAMPLE_REFERENCE } from '~/constants'
export default {
  name: 'DataTableSampleReference',
  components: { BaseDataTable },
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
      localHeaders: cloneDeep(HEADERS_SAMPLE_REFERENCE),
    }
  },
  methods: {
    round,
  },
}
</script>
