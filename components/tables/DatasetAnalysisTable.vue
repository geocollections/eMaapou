<template>
  <table-wrapper
    v-bind="{ showSearch }"
    :headers="headers"
    :items="items"
    :options="options"
    :count="count"
    v-on="$listeners"
  >
    <template #item.analysis="{ item }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'analysis-id', params: { id: item.analysis } })"
      >
        {{ item.analysis }}
      </nuxt-link>
    </template>
    <template #item.sample="{ item }">
      <nuxt-link
        v-if="item.analysis__sample__id"
        class="text-link"
        :to="
          localePath({
            name: 'sample-id',
            params: { id: item.analysis__sample__id },
          })
        "
      >
        {{ item.analysis__sample__number }}
      </nuxt-link>
    </template>
  </table-wrapper>
</template>

<script>
import { round } from 'lodash'
import TableWrapper from '~/components/tables/TableWrapper.vue'
export default {
  name: 'DatasetAnalysisTable',
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
        { text: this.$t('datasetAnalysis.analysis'), value: 'analysis' },
        {
          text: this.$t('datasetAnalysis.sampleNumber'),
          value: 'sample',
        },
      ],
    }
  },
  methods: {
    round,
  },
}
</script>
