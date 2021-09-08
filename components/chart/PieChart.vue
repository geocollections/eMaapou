<template>
  <div class="pa-2">
    <chart-wrapper
      v-if="!isLoading"
      :options="chartOptions"
      :use-deep-merge="false"
    />
  </div>
</template>

<script>
import ChartWrapper from '@/components/chart/ChartWrapper'
import { isNil } from 'lodash'
export default {
  components: { ChartWrapper },
  props: {
    tableKey: {
      type: String,
      required: true,
      default: 'locality_id',
    },
    tableId: {
      type: Number,
      default: null,
    },
    tableObject: {
      type: Object,
      default: () => {},
    },
    chartTitle: {
      type: String,
      required: true,
      default: 'Chart title',
    },
  },
  data() {
    return {
      isLoading: false,
      taxonList: [],
      depth: [],
      parameters: [],
      selectedParameters: [],
      methods: {},
      initSelectedParameters: [],
    }
  },
  async fetch() {
    this.isLoading = true
    if (this.taxonList.length === 0) {
      const { resultsResponse } = await this.fetchChartData()
      this.taxonList = resultsResponse?.items
    }
    this.isLoading = false
  },
  computed: {
    chartOptions() {
      if (this?.taxonList?.length > 0) {
        return {
          title: {
            text: this.chartTitle,
          },

          legend: {},

          grid: {
            show: false,
          },

          series: this.buildChartSeries(),
        }
      } else return {}
    },
  },
  methods: {
    async fetchChartData() {
      const resultsResponse = await this.$services.sarvREST.getResourceList(
        'taxon_list',
        {
          isValid: isNil(this.tableId),
          defaultParams: {
            [this.tableKey]: this.tableId,
            fields: 'id,name,taxon,frequency',
            nest: 1,
          },
          options: {
            page: 1,
            itemsPerPage: 1000,
          },
        }
      )

      return { resultsResponse }
    },

    buildChartTitle() {
      return {
        text: this.$translate({
          et: this?.localityObject?.locality,
          en: this?.localityObject?.locality_en,
        }),
      }
    },

    buildChartSeries() {
      return [
        {
          type: 'pie',
          radius: '50%',
          itemStyle: {
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#fff',
          },
          data: this.taxonList.map((item) => {
            return {
              value: item.frequency,
              name: item.taxon?.taxon ?? item.name,
            }
          }),
        },
      ]
    },
  },
}
</script>

<style scoped></style>
