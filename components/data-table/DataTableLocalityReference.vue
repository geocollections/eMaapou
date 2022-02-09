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
        >{{ item.reference.reference }}</a
      >
    </template>
    <template #item.title="{ item }">
      <div v-if="item.reference">{{ item.reference.title }}</div>
    </template>
  </base-data-table>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { HEADERS_LOCALITY_REFERENCE } from '~/constants'
import headersMixin from '~/mixins/headersMixin'
export default {
  name: 'DataTableLocalityReference',
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
      localHeaders: cloneDeep(HEADERS_LOCALITY_REFERENCE),
    }
  },
  methods: {
    round,
  },
}
</script>
