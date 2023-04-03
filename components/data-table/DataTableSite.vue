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
        :to="localePath({ name: 'site-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.name="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.id } })"
      >
        {{
          $translate({
            et: item.name,
            en: item.name_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.area="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'area-id', params: { id: item.area_id } })"
      >
        {{
          $translate({
            et: item.area_name,
            en: item.area_name_en,
          })
        }}
      </nuxt-link>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, toRef } from '@nuxtjs/composition-api'
import { useHeadersWithState } from '~/composables/useHeaders'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { HEADERS_SITE } from '~/constants'
export default defineComponent({
  name: 'DataTableSite',
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
    const { headers, handleHeadersReset, handleHeadersChange } =
      useHeadersWithState({
        module: 'site',
        localHeaders: HEADERS_SITE,
        statefulHeaders: props.statefulHeaders,
        options: toRef(props, 'options'),
      })
    return { headers, handleHeadersChange, handleHeadersReset }
  },
})
</script>
