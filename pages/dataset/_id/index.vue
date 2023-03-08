<template>
  <div>
    <data-table-sample-data
      :items="sampleData"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      :additional-headers="parameterHeaders"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import DataTableSampleData from '~/components/data-table/DataTableSampleData.vue'
import { SAMPLE_DATA, HEADERS_SAMPLE_DATA } from '~/constants'

export default {
  components: { DataTableSampleData },
  props: {
    parameterHeaders: {
      type: Object,
      default: () => {
        return { byIds: {}, allIds: [] }
      },
    },
  },
  data() {
    return {
      sampleData: [],
      count: 0,
      options: SAMPLE_DATA.options,
      search: '',
    }
  },
  async fetch() {
    const sampleDataResponse = await this.$services.sarvSolr.getResourceList(
      'sample_data',
      {
        search: this.search,
        options: this.options,
        defaultParams: {
          fq: `dataset_ids:${this.$route.params.id}`,
        },
        fields: this.mergedFields,
      }
    )
    this.sampleData = sampleDataResponse.items
    this.count = sampleDataResponse.count
  },
  computed: {
    mergedFields() {
      const parameterFields = Object.values(this.parameterHeaders).reduce(
        (obj, item) => ({ ...obj, [item.value]: item.value }),
        {}
      )
      return {
        ...this.$getAPIFieldValues(HEADERS_SAMPLE_DATA),
        ...parameterFields,
      }
    },
  },
  methods: {
    handleUpdate(tableState) {
      this.options = tableState.options
      this.search = tableState.search
      this.$fetch()
    },
  },
}
</script>
