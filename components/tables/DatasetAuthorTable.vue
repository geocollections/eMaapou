<template>
  <table-wrapper
    v-bind="$attrs"
    :headers="$_headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
    @change:headers="$_handleHeadersChange"
    @reset:headers="$_handleHeadersReset"
  >
    <template #item.name="{ item }"
      ><div v-if="item.agent">{{ item.agent.agent }}</div></template
    >
    <template #item.affiliation="{ item }">{{ item.affiliation }}</template>
    <template #item.type="{ item }"
      ><div v-if="item.agent_type">{{ item.agent_type.value }}</div></template
    >
  </table-wrapper>
</template>

<script>
import { round, cloneDeep } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
import headersMixin from '~/mixins/headersMixin'
import { HEADERS_DATASET_AUTHOR } from '~/constants'
export default {
  name: 'DatasetAuthorTable',
  components: { TableWrapper },
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
      localHeaders: cloneDeep(HEADERS_DATASET_AUTHOR),
    }
  },
  methods: {
    round,
  },
}
</script>
