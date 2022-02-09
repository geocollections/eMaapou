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
    <template #item.id="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'locality-id', params: { id: item.id } })"
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
    </template>
    <template #item.country="{ item }">
      {{ $translate({ et: item.country, en: item.country_en }) }}
    </template>
  </base-data-table>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import { mapState } from 'vuex'
import BaseDataTable from '~/components/base/BaseDataTable.vue'
import { HEADERS_LOCALITY } from '~/constants'
import headersMixin from '~/mixins/headersMixin'
export default {
  name: 'DataTableLocality',
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
      localHeaders: cloneDeep(HEADERS_LOCALITY),
      module: 'locality',
    }
  },
  computed: {
    ...mapState('headers', { stateHeaders: 'locality' }),
  },
  methods: {
    round,
  },
}
</script>
