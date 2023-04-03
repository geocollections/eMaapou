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
    <template #item.id="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
    </template>
    <template #item.country="{ item }">
      {{ $translate({ et: item.country, en: item.country_en }) }}
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { toRef, defineComponent, PropType } from '@nuxtjs/composition-api'
import { useHeadersWithState } from '~/composables/useHeaders'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { HEADERS_LOCALITY } from '~/constants'
import { IOptions } from '~/services'
export default defineComponent({
  name: 'DataTableLocality',
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
        module: 'locality',
        localHeaders: HEADERS_LOCALITY,
        statefulHeaders: props.statefulHeaders,
        options: toRef(props, 'options'),
      })
    return { headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
