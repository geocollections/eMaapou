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
    <template #item.name="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'area-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.name, en: item.name_en }) }}
      </nuxt-link>
    </template>
    <template #item.county="{ item }">
      <span>{{ $translate({ et: item.maakond, en: item.maakond_en }) }}</span>
    </template>
    <template #item.type="{ item }">
      <span>
        {{ $translate({ et: item.area_type, en: item.area_type_en }) }}
      </span>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef } from '@nuxtjs/composition-api'
import { useHeadersWithState } from '~/composables/useHeaders'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { HEADERS_AREA } from '~/constants'
import { IOptions } from '~/services'
export default defineComponent({
  name: 'DataTableArea',
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
      type: Object as PropType<IOptions>,
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
    const { headers, handleHeadersChange, handleHeadersReset } =
      useHeadersWithState({
        module: 'area',
        localHeaders: HEADERS_AREA,
        statefulHeaders: props.statefulHeaders,
        options: toRef(props, 'options'),
      })
    return { headers, handleHeadersChange, handleHeadersReset }
  },
})
</script>
