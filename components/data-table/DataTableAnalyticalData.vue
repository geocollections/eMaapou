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
    <template #item.id_l="{ item }">
      <nuxt-link
        v-if="item.id_l"
        class="text-link"
        :to="localePath({ name: 'analysis-id', params: { id: item.id_l } })"
      >
        {{ item.id_l }}
      </nuxt-link>
    </template>
    <template #item.analysis_method="{ item }">
      {{
        $translate({ et: item.analysis_method, en: item.analysis_method_en })
      }}
    </template>
    <template #item.sample_number="{ item }">
      <nuxt-link
        v-if="item.sample_id"
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.sample_id } })"
      >
        {{ item.sample_number || item.sample_id }}
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
        v-if="item.lithostratigraphy_id"
        class="text-link font-italic"
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
    <template #item.reference="{ item }">
      <base-link-external
        v-if="item.reference_id"
        @click.native="$openGeology('reference', item.reference_id)"
      >
        {{ item.reference }}
      </base-link-external>
      <div v-else>{{ item.reference_str }}</div>
    </template>
    <template #item.dataset_id="{ item }">
      <nuxt-link
        v-if="item.dataset_id"
        class="text-link"
        :to="
          localePath({ name: 'dataset-id', params: { id: item.dataset_id } })
        "
      >
        {{ item.dataset_id }}
      </nuxt-link>
    </template>
    <template #item.analysis_id="{ item }">
      <nuxt-link
        v-if="item.analysis_id"
        class="text-link"
        :to="
          localePath({ name: 'analysis-id', params: { id: item.analysis_id } })
        "
      >
        {{ item.analysis_id }}
      </nuxt-link>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, toRef } from '@nuxtjs/composition-api'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal.vue'
import { HEADERS_ANALYTICAL_DATA } from '~/constants'
import { useHeadersWithState } from '~/composables/useHeaders'

export default defineComponent({
  name: 'DataTableAnalyticalData',
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
    statefulHeaders: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { headers, handleHeadersChange, handleHeadersReset } =
      useHeadersWithState({
        module: 'analytical_data',
        localHeaders: HEADERS_ANALYTICAL_DATA,
        statefulHeaders: props.statefulHeaders,
        options: toRef(props, 'options'),
      })
    return { headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
