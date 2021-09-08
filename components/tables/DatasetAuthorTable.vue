<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
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
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'DatasetAuthorTable',
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
        { text: this.$t('datasetAuthor.name'), value: 'name' },
        { text: this.$t('datasetAuthor.affiliation'), value: 'affiliation' },
        { text: this.$t('datasetAuthor.type'), value: 'type' },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
