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
    <template #item.taxon="{ item }">
      <base-link-external
        v-if="item.id"
        @click.native="$openWindow(`https://fossiilid.info/${item.id}`)"
      >
        {{ `${item.taxon} ${item.author_year ? item.author_year : ''}` }}
      </base-link-external>
    </template>

    <template #item.fossil_group="{ item }">
      <base-link-external
        v-if="item.fossil_group_id"
        @click.native="
          $openWindow(`https://fossiilid.info/${item.fossil_group_id}`)
        "
      >
        {{ item.fossil_group }}
      </base-link-external>
      <div v-else>{{ item.fossil_group }}</div>
    </template>

    <template #item.parent_taxon="{ item }">
      <base-link-external
        v-if="item.parent_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.parent_id}`)"
      >
        {{ item.parent_taxon }}
      </base-link-external>
      <div v-else>{{ item.parent_taxon }}</div>
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
    </template>

    <template #item.fad="{ item }">
      <nuxt-link
        v-if="item.fad_id"
        class="text-link"
        :to="
          localePath({ name: 'stratigraphy-id', params: { id: item.fad_id } })
        "
      >
        {{ $translate({ et: item.fad, en: item.fad_en }) }}
      </nuxt-link>
    </template>
    <template #item.lad="{ item }">
      <nuxt-link
        v-if="item.lad_id"
        class="text-link"
        :to="
          localePath({ name: 'stratigraphy-id', params: { id: item.lad_id } })
        "
      >
        {{ $translate({ et: item.lad, en: item.lad_en }) }}
      </nuxt-link>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef } from '@nuxtjs/composition-api'
import { useHeadersWithState } from '~/composables/useHeaders'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal.vue'
import { HEADERS_TAXON } from '~/constants'
import { IOptions } from '~/services'

export default defineComponent({
  name: 'DataTableTaxon',
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
    statefulHeaders: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { headers, handleHeadersReset, handleHeadersChange } =
      useHeadersWithState({
        module: 'taxon',
        localHeaders: HEADERS_TAXON,
        options: toRef(props, 'options'),
        statefulHeaders: props.statefulHeaders,
      })
    return { headers, handleHeadersChange, handleHeadersReset }
  },
})
</script>
