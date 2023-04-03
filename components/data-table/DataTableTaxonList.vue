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
        v-if="item.taxon"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon.id}`)"
      >
        {{ item.taxon.taxon }}
      </base-link-external>
    </template>

    <template #item.agent="{ item }">
      <div v-if="item.agent_identified">
        {{ item.agent_identified.agent }}
      </div>
    </template>

    <template #item.extra="{ item }">
      <v-icon v-if="item.extra">{{ icons.mdiPlus }}</v-icon>
      <v-icon v-else>{{ icons.mdiMinus }}</v-icon>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { mdiPlus, mdiMinus } from '@mdi/js'
import { computed, defineComponent, toRef } from '@nuxtjs/composition-api'
import { useHeaders } from '~/composables/useHeaders'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal.vue'
import { HEADERS_TAXON_LIST } from '~/constants'

export default defineComponent({
  name: 'DataTableTaxonList',
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
  },
  setup(props) {
    const icons = computed(() => {
      return {
        mdiPlus,
        mdiMinus,
      }
    })
    const { headers, handleHeadersReset, handleHeadersChange } = useHeaders({
      localHeaders: HEADERS_TAXON_LIST,
      options: toRef(props, 'options'),
    })
    return { icons, headers, handleHeadersChange, handleHeadersReset }
  },
})
</script>
