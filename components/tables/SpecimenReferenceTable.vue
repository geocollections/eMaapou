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
      <external-link
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </external-link>
    </template>
  </table-wrapper-test>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import TableWrapperTest from '~/components/tables/TableWrapperTest.vue'
import ExternalLink from '~/components/ExternalLink.vue'
import { HEADERS_SPECIMEN_REFERENCE } from '~/constants'
export default {
  name: 'SpecimenReferenceTable',
  components: { TableWrapperTest, ExternalLink },
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
      localHeaders: cloneDeep(HEADERS_SPECIMEN_REFERENCE),
    }
  },
  methods: {
    round,
  },
}
</script>
