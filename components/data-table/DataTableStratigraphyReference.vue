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
    <template #item.year="{ item }">
      <div v-if="item.reference">
        {{ item.reference.year }}
      </div>
    </template>
    <template #item.content="{ item }">
      {{ $translate({ et: item.content, en: item.content_en }) }}
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, toRef } from '@nuxtjs/composition-api'
import BaseLinkExternal from '../base/BaseLinkExternal.vue'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { HEADERS_STRATIGRAPHY_REFERENCE } from '~/constants'
import { useHeaders } from '~/composables/useHeaders'

export default defineComponent({
  name: 'DataTableStratigraphyReference',
  components: { BaseDataTable, BaseLinkExternal },
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
      localHeaders: HEADERS_STRATIGRAPHY_REFERENCE,
      options: toRef(props, 'options'),
    })
    return { headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
