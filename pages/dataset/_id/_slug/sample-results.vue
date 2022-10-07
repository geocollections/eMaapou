<template>
  <data-table-sample-data
    :items="sampleData"
    :count="count"
    :options="options"
    :additional-headers="parameterHeaders"
    @update="handleUpdate"
  />
</template>

<script>
import isNil from 'lodash/isNil'
import DataTableSampleData from '~/components/data-table/DataTableSampleData'
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
    }
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
    async handleUpdate(tableState) {
      this.options = tableState.options
      const sampleDataResponse = await this.$services.sarvSolr.getResourceList(
        'sample_data',
        {
          ...tableState,
          isValid: isNil(this.$route.params.id),
          defaultParams: {
            fq: `dataset_ids:${this.$route.params.id}`,
          },
          fields: this.mergedFields,
        }
      )
      this.sampleData = sampleDataResponse.items
      this.count = sampleDataResponse.count
    },
  },
}
</script>
