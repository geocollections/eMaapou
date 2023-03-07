<template>
  <base-data-table
    v-bind="$attrs"
    :headers="$_headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="$_handleHeadersChange"
    @reset:headers="$_handleHeadersReset"
  >
    <template #item.taxon="{ item }">
      <base-link-external
        v-if="item.taxon_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
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
    <template #item.parent="{ item }">
      <base-link-external
        v-if="item.parent_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.parent_id}`)"
      >
        {{ item.parent_taxon }}
      </base-link-external>
    </template>
    <template #item.src="{ item }">
      <div v-if="item.src">
        {{ $translate({ et: item.src_txt, en: item.src_txt_en }) }}
      </div>
    </template>
  </base-data-table>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import BaseLinkExternal from '~/components/base/BaseLinkExternal.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_FOSSIL } from '~/constants'
export default {
  name: 'DataTableFossil',
  components: { BaseLinkExternal, BaseDataTable },
  mixins: [headersMixin],
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
  data() {
    return {
      localHeaders: cloneDeep(HEADERS_FOSSIL),
    }
  },
}
</script>
