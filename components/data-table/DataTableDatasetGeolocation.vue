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
    <template #item.name="{ item }">
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
      </nuxt-link></template
    >
    <template #item.longitude="{ item }">{{ item.point_longitude }}</template>
    <template #item.latitude="{ item }">{{ item.point_latitude }}</template>
    <template #item.is_polygon="{ item }">
      <v-icon v-if="item.polygon" color="green" small>mdi-check-bold</v-icon>
      <v-icon v-else color="red" small>mdi-close-thick</v-icon>
    </template>
  </base-data-table>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import BaseDataTable from '../base/BaseDataTable.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_DATASET_GEOLOCATION } from '~/constants'
export default {
  name: 'DataTableDatasetGeolocation',
  components: { BaseDataTable },
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
      localHeaders: cloneDeep(HEADERS_DATASET_GEOLOCATION),
    }
  },
  methods: {
    round,
  },
}
</script>
