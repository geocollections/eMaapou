<template>
  <sample-chart-wrapper
    v-if="!isLoading"
    :options="chartOptions"
    hide-renderer-switch
  />
</template>

<script>
import { isNil } from 'lodash'
import SampleChartWrapper from '~/components/chart/SampleChartWrapper'

export default {
  name: 'SampleChart',
  components: { SampleChartWrapper },
  props: {
    tableKey: {
      type: String,
      required: true,
      default: 'locality_id',
    },
    tableId: {
      type: String,
      default: '',
    },
    chartTitle: {
      type: String,
      required: false,
      default: 'Chart title',
    },
    minDepth: {
      type: Number,
      required: true,
      default: 0,
    },
    maxDepth: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  data() {
    return {
      isLoading: false,
      sampleResults: [],
      depth: [],
    }
  },
  async fetch() {
    this.isLoading = true
    if (this.sampleResults.length === 0) {
      const { resultsResponse } = await this.fetchChartData()
      this.sampleResults = resultsResponse?.items
    }
    this.isLoading = false
  },
  computed: {
    chartOptions() {
      if (this.sampleResults?.length > 0) {
        return {
          animation: false,

          title: {
            text: this.chartTitle,
          },

          xAxis: this.buildXAxis(),

          yAxis: this.buildYAxis(),

          series: this.buildChartSeries(),
        }
      } else return {}
    },
  },
  methods: {
    async fetchChartData() {
      const resultsResponse = await this.$services.sarvSolr.getResourceList(
        'sample',
        {
          isValid: isNil(this.tableId),
          defaultParams: {
            fq: `${this.tableKey}:${this.tableId} AND (depth:[* TO *] OR depth_interval:[* TO *])`,
            start: 0,
            rows: 50000,
            fl: 'id,number,depth,depth_interval,',
            sort: 'depth asc',
          },
        }
      )

      return { resultsResponse }
    },

    buildXAxis() {
      return {
        type: 'category',
        data: ['Sample'],
      }
    },

    buildYAxis() {
      return {
        show: true,
        type: 'value',
        boundaryGap: false,
        name: 'Depth',
        nameLocation: 'end',
        nameTextStyle: {
          fontWeight: 'bold',
        },
        nameGap: 10,
        splitNumber: 7,
        axisTick: {
          alignWithLabel: true,
        },
        max:
          this.maxDepth > 0 && this.maxDepth > this.minDepth
            ? this.minDepth * -1
            : this.maxDepth,
        min:
          this.minDepth > 0 && this.minDepth < this.maxDepth
            ? this.maxDepth * -1
            : this.minDepth,
      }
    },

    buildChartSeries() {
      console.log(this.sampleResults)
      return this.sampleResults.map((item) => {
        return {
          type: 'line',
          name: item.number || item.id,
          color: 'black',
          data:
            item?.depth && item?.depth_interval
              ? [item.depth, item.depth_interval]
              : item?.depth
              ? [item.depth]
              : [item.depth_interval],
          lineStyle: {
            width: 30,
          },
          symbol: 'rect',
          symbolSize: 0,
          showAllSymbol: false,
          label: {
            show: true,
            position: 'right',
            distance: 25,
            formatter(params) {
              return `${params.seriesName}`
            },
          },
        }
      })
    },
  },
}
</script>
