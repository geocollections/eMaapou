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
    <template #item.sample="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.sample_id } })"
      >
        {{ item.sample_number }}
      </nuxt-link>
    </template>
    <template #item.number="{ item }">
      <nuxt-link
        v-if="item.number"
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.id } })"
      >
        {{ item.number }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        v-if="item.locality_id"
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality_id } })
        "
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
      <nuxt-link
        v-else-if="item.site_id"
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.site_id } })"
      >
        {{ item.site }}
      </nuxt-link>
    </template>
    <template #item.stratigraphy="{ item }">
      <nuxt-link
        v-if="item.stratigraphy_id"
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.stratigraphy_id },
          })
        "
      >
        {{
          $translate({
            et: item.stratigraphy,
            en: item.stratigraphy_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.lithostratigraphy="{ item }">
      <nuxt-link
        v-if="item.lithostratigraphy"
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.lithostratigraphy_id },
          })
        "
      >
        {{
          $translate({
            et: item.lithostratigraphy,
            en: item.lithostratigraphy_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.date_collected="{ item }">
      {{ item.date_collected ? $formatDate(item.date_collected) : null }}
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, toRef } from '@nuxtjs/composition-api'
import cloneDeep from 'lodash/cloneDeep'
import { useHeaders } from '~/composables/useHeaders'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { HEADERS_SAMPLE_DATA } from '~/constants'

export default defineComponent({
  name: 'DataTableSampleData',
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
    additionalHeaders: {
      type: Object,
      default: () => {
        return { byIds: {}, allIds: [] }
      },
    },
  },
  setup(props) {
    const getHeaders = () => {
      const defaultHeaders = cloneDeep(HEADERS_SAMPLE_DATA)
      return {
        byIds: {
          ...defaultHeaders.byIds,
          ...Object.entries(props.additionalHeaders.byIds).reduce(
            (prev, [key, value]) => {
              // @ts-ignore
              return { ...prev, [key]: { ...value, translate: false } }
            },
            {}
          ),
        },
        allIds: [...defaultHeaders.allIds, ...props.additionalHeaders.allIds],
      }
    }
    const { headers, handleHeadersChange, handleHeadersReset } = useHeaders({
      localHeaders: getHeaders(),
      options: toRef(props, 'options'),
    })
    return { headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
