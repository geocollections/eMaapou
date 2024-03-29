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
    <template #item.language="{ item }">
      <div v-if="item.language">
        {{
          $translate({ et: item.language.value, en: item.language.value_en })
        }}
      </div>
    </template>
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
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal.vue'
import { HEADERS_STRATIGRAPHY_SYNONYM } from '~/constants'
import { useHeaders } from '~/composables/useHeaders'

export default defineComponent({
  name: 'DataTableStratigraphySynonym',
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
  },
  setup(props) {
    const { headers, handleHeadersChange, handleHeadersReset } = useHeaders({
      localHeaders: HEADERS_STRATIGRAPHY_SYNONYM,
      options: toRef(props, 'options'),
    })
    return { headers, handleHeadersChange, handleHeadersReset }
  },
})
</script>
