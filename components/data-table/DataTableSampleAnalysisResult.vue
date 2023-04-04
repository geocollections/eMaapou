<template>
  <base-data-table
    v-bind="$attrs"
    :headers="computedHeaders"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="handleHeadersChange"
    @reset:headers="handleHeadersReset"
  >
    <template #item.analysis_method="{ item }">{{
      $translate({ et: item.analysis_method, en: item.analysis_method_en })
    }}</template>
  </base-data-table>
</template>

<script lang="ts">
import { computed, defineComponent, toRef } from '@nuxtjs/composition-api'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { HEADERS_SAMPLE_ANALYSIS_RESULT } from '~/constants'
import { useHeaders } from '~/composables/useHeaders'

export default defineComponent({
  name: 'DataTableSampleAnalysisResult',
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
    hideDepth: Boolean,
    hideMethod: Boolean,
  },
  setup(props) {
    const { headers, handleHeadersChange, handleHeadersReset } = useHeaders({
      localHeaders: HEADERS_SAMPLE_ANALYSIS_RESULT,
      options: toRef(props, 'options'),
    })

    const computedHeaders = computed(() => {
      return headers.value.filter((header) => {
        if (header.value.includes('depth')) return !props.hideDepth
        if (header.value === 'analysis_method') return !props.hideMethod
        else return header
      })
    })
    return { computedHeaders, handleHeadersReset, handleHeadersChange }
  },
})
</script>
