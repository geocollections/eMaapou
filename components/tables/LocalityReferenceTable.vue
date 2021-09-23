<template>
  <table-wrapper-test
    v-bind="$attrs"
    :headers="$_headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="$_handleHeadersChange"
    @reset:headers="$_handleHeadersReset"
  >
    <template #item.reference="{ item }">
      <a
        v-if="item.reference"
        class="text-link"
        @click="$openGeology('reference', item.reference.id)"
        >{{ item.reference.reference }}</a
      >
    </template>
    <template #item.title="{ item }">
      <div v-if="item.reference">{{ item.reference.title }}</div>
    </template>
  </table-wrapper-test>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import TableWrapperTest from '~/components/tables/TableWrapperTest.vue'
import { HEADERS_LOCALITY_REFERENCE } from '~/constants'
export default {
  name: 'LocalityReferenceTable',
  components: { TableWrapperTest },
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
      localHeaders: cloneDeep(HEADERS_LOCALITY_REFERENCE),
    }
  },
  methods: {
    round,
  },
}
</script>
