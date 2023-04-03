<template>
  <base-data-table
    v-bind="$attrs"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset"
  >
    <template #item.reference="{ item }">
      <base-link-external
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </base-link-external>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, toRef } from '@nuxtjs/composition-api'
import { useHeaders } from '~/composables/useHeaders'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal.vue'
import { HEADERS_SYNONYM } from '~/constants'

export default defineComponent({
  name: 'DataTableSynonym',
  components: { BaseLinkExternal, BaseDataTable },
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
    statefulHeaders: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { headers, handleHeadersReset, handleHeadersChange } = useHeaders({
      localHeaders: HEADERS_SYNONYM,
      options: toRef(props, 'options'),
    })
    return { headers, handleHeadersChange, handleHeadersReset }
  },
})
</script>
