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
    <template #item.name="{ item }">
      {{ item.name }}
    </template>
    <template #item.affiliation="{ item }">{{ item.affiliation }}</template>
    <template #item.type="{ item }"
      ><div v-if="item.agent_type">{{ item.agent_type.value }}</div></template
    >
  </base-data-table>
</template>

<script>
import round from 'lodash/round'
import cloneDeep from 'lodash/cloneDeep'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_DATASET_AUTHOR } from '~/constants'
export default {
  name: 'DataTableDatasetAuthor',
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
      localHeaders: cloneDeep(HEADERS_DATASET_AUTHOR),
    }
  },
  methods: {
    round,
  },
}
</script>
