<template>
  <base-data-table
    v-bind="$attrs"
    :headers="filteredHeaders"
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
        :to="localePath({ name: 'analysis-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.sample_number="{ item }">
      <nuxt-link
        v-if="item.sample_id"
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.sample_id } })"
      >
        {{ item.sample_number }}
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
        {{ $translate({ et: item.name, en: item.name_en }) }}
      </nuxt-link>
    </template>
    <template #item.thickness="{ item }">
      {{
        !item.depth_interval || !item.depth
          ? null
          : round(item.depth_interval - item.depth, 3)
      }}
    </template>
    <template #item.method="{ item }">
      {{
        $translate({
          et: item.analysis_method,
          en: item.analysis_method_en,
        })
      }}
    </template>
    <template #item.method_details="{ item }">
      {{
        $translate({
          et: item.method_details,
          en: item.method_details_en,
        })
      }}
    </template>
    <template #item.date="{ item }">
      <div v-if="item.date">
        {{ item.date ? $formatDate(item.date) : null }}
      </div>
      <div v-else>{{ item.date_free }}</div>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import round from 'lodash/round'
// import cloneDeep from 'lodash/cloneDeep'
import {
  computed,
  defineComponent,
  PropType,
  // reactive,
  toRef,
  // useContext,
} from '@nuxtjs/composition-api'
import { useHeadersWithState } from '~/composables/useHeaders'
import { HEADERS_ANALYSIS, Header } from '~/constants'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { IOptions } from '~/services'

export default defineComponent({
  name: 'DataTableAnalysis',
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
    hideDepth: Boolean,
    hideLocality: Boolean,
    hideSample: Boolean,
  },
  setup(props) {
    const { headers, handleHeadersChange, handleHeadersReset } = useHeadersWithState({
      module: 'analysis',
      localHeaders: HEADERS_ANALYSIS,
      statefulHeaders: props.statefulHeaders,
      options: toRef(props, 'options'),
    })

    const filteredHeaders = computed(() => {
      return headers.value.filter((item: Header) => {
        if (item.value.includes('depth')) return !props.hideDepth
        else if (item.value === 'locality') return !props.hideLocality
        else if (item.value === 'sample_number') return !props.hideSample
        else return item
      })
    })
    return {
      headers,
      filteredHeaders,
      handleHeadersReset,
      handleHeadersChange,
      round,
    }
  },
})
</script>
