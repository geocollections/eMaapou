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
        v-if="item.id"
        class="text-link"
        :to="localePath({ name: 'dataset-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>

    <template #item.name="{ item }">
      <nuxt-link
        v-if="item.title"
        class="text-link"
        :to="localePath({ name: 'dataset-id', params: { id: item.id } })"
      >
        {{ item.title }}
      </nuxt-link>
    </template>

    <template #item.date="{ item }">
      <div v-if="item.date">
        {{ $formatDate(item.date) }}
      </div>
      <div v-else>{{ item.date_txt }}</div>
    </template>

    <template #item.database_acronym="{ item }">
      <nuxt-link
        class="text-link"
        :to="
          localePath({
            name: `institution-${item.database_acronym.toLowerCase()}`,
          })
        "
      >
        {{ item.database_acronym }}
      </nuxt-link>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, toRef } from '@nuxtjs/composition-api'
import { useHeadersWithState } from '~/composables/useHeaders'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { HEADERS_DATASET } from '~/constants'
export default defineComponent({
  name: 'DataTableDataset',
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
    statefulHeaders: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { headers, handleHeadersChange, handleHeadersReset } =
      useHeadersWithState({
        module: 'dataset',
        localHeaders: HEADERS_DATASET,
        statefulHeaders: props.statefulHeaders,
        options: toRef(props, 'options'),
      })
    return { headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
