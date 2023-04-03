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
      <base-link-external
        v-if="item.id"
        @click.native="$openWindow(`https://kivid.info/${item.id}`)"
      >
        {{ item.id }}
      </base-link-external>
    </template>

    <template #item.formula="{ item }">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="item.formula_html" v-html="item.formula_html" />
      <div v-else>{{ item.formula }}</div>
    </template>

    <template #item.in_estonia="{ item }">
      <base-boolean :value="!!item.in_estonia" />
    </template>

    <template #item.mindat_id="{ item }">
      <base-link-external
        v-if="item.mindat_id"
        @click.native="
          $openWindow(`https://www.mindat.org/min-${item.mindat_id}.html`)
        "
      >
        {{ item.mindat_id }}
      </base-link-external>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, toRef } from '@nuxtjs/composition-api'
import { useHeaders } from '~/composables/useHeaders'
import BaseBoolean from '~/components/base/BaseBoolean.vue'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal.vue'
import { HEADERS_ROCK } from '~/constants'
export default defineComponent({
  name: 'DataTableRock',
  components: { BaseLinkExternal, BaseDataTable, BaseBoolean },
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
      localHeaders: HEADERS_ROCK,
      options: toRef(props, 'options'),
    })
    return { headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
