<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.name="{ item }">{{
      $translate({
        et: item.locality__locality,
        en: item.locality__locality_en,
      })
    }}</template>
    <template #item.longitude="{ item }">{{ item.point_longitude }}</template>
    <template #item.latitude="{ item }">{{ item.point_latitude }}</template>
    <template #item.is_polygon="{ item }">
      <v-icon v-if="item.polygon" color="green" small>mdi-check-bold</v-icon>
      <v-icon v-else color="red" small>mdi-close-thick</v-icon>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'DatasetGeolocationTable',
  components: { TableWrapper },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
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
      headers: [
        { text: this.$t('datasetGeolocation.name'), value: 'name' },
        { text: this.$t('datasetGeolocation.longitude'), value: 'longitude' },
        { text: this.$t('datasetGeolocation.latitude'), value: 'latitude' },
        {
          text: this.$t('datasetGeolocation.isPolygon'),
          value: 'is_polygon',
          sortable: false,
        },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
