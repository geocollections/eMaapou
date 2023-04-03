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
    <template #item.identifier="{ item }">
      <base-link-external
        v-if="item.identifier"
        @click.native="
          $openWindow(`http://doi.geocollections.info/${item.identifier}`)
        "
        >{{ item.identifier }}</base-link-external
      >
    </template>

    <template #item.datacite_created="{ item }">
      <div v-if="item.datacite_created">
        <div>
          {{ $formatDate(item.datacite_created) }}
        </div>
        <div
          v-if="
            item.datacite_updated &&
            item.datacite_created !== item.datacite_updated
          "
        >
          ({{ $formatDate(item.datacite_updated) }})
        </div>
      </div>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef } from '@nuxtjs/composition-api'
import { useHeaders } from '~/composables/useHeaders'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal.vue'
import { HEADERS_DOI } from '~/constants'
import { IOptions } from '~/services'

export default defineComponent({
  name: 'DataTableDoi',
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
      type: Object as PropType<IOptions>,
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
      localHeaders: HEADERS_DOI,
      options: toRef(props, 'options'),
    })
    return { headers, handleHeadersChange, handleHeadersReset }
  },
})
</script>
