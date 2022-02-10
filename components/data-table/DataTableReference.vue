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
        v-if="item.id"
        @click.native="$openGeology('reference', item.id)"
      >
        {{ item.reference }}
      </base-link-external>
    </template>

    <template #item.journal="{ item }">
      <div v-if="item.journal__journal_name">
        {{ item.journal__journal_name }}
      </div>
      <div v-else-if="item.book">{{ item.book }}</div>
    </template>

    <template #item.doi="{ item }">
      <base-link-external
        v-if="item.doi"
        @click.native="$openWindow(`https://doi.org/${item.doi}`)"
      >
        {{ item.doi }}
      </base-link-external>
    </template>
  </base-data-table>
</template>

<script>
import { cloneDeep } from 'lodash'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_REFERENCE } from '~/constants'
export default {
  name: 'DataTableReference',
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
      localHeaders: cloneDeep(HEADERS_REFERENCE),
    }
  },
}
</script>
