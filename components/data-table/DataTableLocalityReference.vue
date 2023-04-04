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

<script lang="ts">
import { toRef, defineComponent } from '@nuxtjs/composition-api'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { useHeaders } from '~/composables/useHeaders'
import { HEADERS_LOCALITY_REFERENCE } from '~/constants'

export default defineComponent({
  name: 'DataTableLocalityReference',
  components: { BaseDataTable },
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
  setup(props) {
    const { headers, handleHeadersChange, handleHeadersReset } = useHeaders({
      localHeaders: HEADERS_LOCALITY_REFERENCE,
      options: toRef(props, 'options'),
    })
    return { headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
