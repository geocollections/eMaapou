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
    <template #item.locality="{ item }">
      <nuxt-link
        v-if="item.locality"
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality.id } })
        "
      >
        {{
          $translate({
            et: item.locality.locality,
            en: item.locality.locality_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.type="{ item }">
      <div v-if="item.stratotype_type">
        {{
          $translate({
            et: item.stratotype_type.value,
            en: item.stratotype_type.value_en,
          })
        }}
      </div>
    </template>
    <template #item.reference="{ item }">
      <external-link
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </external-link>
    </template>
  </base-data-table>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import ExternalLink from '../ExternalLink.vue'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_STRATIGRAPHY_STRATOTYPE } from '~/constants'
export default {
  name: 'DataTableStratigraphyStratotype',
  components: { BaseDataTable, ExternalLink },
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
      localHeaders: cloneDeep(HEADERS_STRATIGRAPHY_STRATOTYPE),
    }
  },
  methods: {
    round,
  },
}
</script>
