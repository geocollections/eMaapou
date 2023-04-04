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
      <v-icon v-if="item.polygon" color="green" small>
        {{ icons.mdiCheckBold }}
      </v-icon>
      <v-icon v-else color="red" small>{{ icons.mdiCloseThick }}</v-icon>
    </template>
  </base-data-table>
</template>

<script lang="ts">
import { computed, defineComponent, toRef } from '@nuxtjs/composition-api'
import { mdiCheckBold, mdiCloseThick } from '@mdi/js'
import BaseDataTable from '../base/BaseDataTable.vue'
import { HEADERS_DATASET_GEOLOCATION } from '~/constants'
import { useHeaders } from '~/composables/useHeaders'

export default defineComponent({
  name: 'DataTableDatasetGeolocation',
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
  },
  setup(props) {
    const icons = computed(() => {
      return {
        mdiCheckBold,
        mdiCloseThick,
      }
    })
    const { headers, handleHeadersChange, handleHeadersReset } = useHeaders({
      localHeaders: HEADERS_DATASET_GEOLOCATION,
      options: toRef(props, 'options'),
    })

    return { icons, headers, handleHeadersReset, handleHeadersChange }
  },
})
</script>
