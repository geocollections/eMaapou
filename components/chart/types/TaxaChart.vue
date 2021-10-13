<template>
  <div>
    <taxa-chart-wrapper
      v-for="(item, index) in filteredTaxa"
      :key="index"
      :options="optionsUsingTaxon(item)"
    />
  </div>
</template>

<script>
import TaxaChartWrapper from '~/components/chart/wrappers/TaxaChartWrapper'

export default {
  name: 'TaxaChart',
  components: { TaxaChartWrapper },
  props: {
    chartTitle: {
      type: String,
      required: false,
      default: 'Taxa',
    },
    // Todo: If minDepth and maxDepth are 0 use depth from results
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
    results: {
      type: Array,
      required: true,
      default: () => {},
    },
    taxa: {
      type: Array,
      required: true,
      default: () => {},
    },
  },
  computed: {
    filteredTaxa() {
      return this.results.reduce((prev, curr) => {
        if (!prev.includes(curr.taxon)) prev.push(curr.taxon)
        return prev
      }, [])
    },

    chartOptions() {
      if (this.results?.length > 0) {
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
    optionsUsingTaxon(taxon) {
      return {
        animation: false,

        title: {
          text: taxon,
        },

        yAxis: this.buildYAxis(),

        xAxis: this.buildXAxis(taxon),

        series: this.buildChartSeries(taxon),
      }
    },

    buildXAxis(param) {
      return {
        type: 'category',
        data: [param],
        axisLabel: {
          fontWeight: 'bold',
          padding: [13, 0, 0, 0],
        },
      }
    },

    buildYAxis() {
      return {
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
        axisLine: {
          show: true,
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

    buildChartSeries(taxon) {
      return [
        {
          type: 'scatter',
          color: 'black',
          tooltip: {
            position: 'bottom',
            formatter(params) {
              return `<span class="mr-2" style="display: inline-block; width: 10px; height: 10px; border-radius: 10px; background-color: ${params.color}"></span><span>${params.data.name}
                    <br />Frequency: <b>${params.data.name}</b></span>\
                    <br />Depth: <b>${params.data.sampleDepth}</b></span>
                    <br /><span>Depth interval: <b>${params.data.sampleDepthInterval}</b></span>
                    <br /><span>Symbol size: <b>${params.data.size}</b></span>`
            },
          },
          data: this.results.reduce((prev, curr) => {
            if (curr.taxon === taxon) {
              const depth =
                curr?.depth && curr?.depth_interval
                  ? ((curr.depth + curr.depth_interval) / 2).toFixed(2)
                  : curr?.depth
                  ? curr.depth
                  : curr.depth_interval

              const maxSymbolSize = 30
              const minSymbolSize = 7
              const maxFrequency = 1856 // Highest number from solr index

              const symbolSizeInPercent = (
                (curr.frequency * 100) /
                maxFrequency
              ).toFixed(2)
              const symbolSize = (
                (maxSymbolSize * symbolSizeInPercent) / 100 +
                minSymbolSize
              ).toFixed(2)
              console.log(symbolSize)

              prev.push({
                sampleDepth: -curr.depth,
                sampleDepthInterval: -curr.depth_interval,
                taxonId: curr.taxon_id,
                size: symbolSize,
                name: curr.frequency,
                symbol: 'rect',
                symbolSize,
                value: [0, -depth],
                label: {
                  show: true,
                  position: 'right',
                  // distance: 15,
                  formatter(params) {
                    return `${params.data.name}`
                  },
                },
              })
            }
            return prev
          }, []),
        },
      ]
      // return [
      //   {
      //     name: taxon,
      //     type: 'line',
      //     smooth: false,
      //     xAxisIndex: 0,
      //     data: this.results.reduce((prev, curr) => {
      //       if (curr.taxon === taxon) {
      //         const depth =
      //           curr?.depth && curr?.depth_interval
      //             ? ((curr.depth + curr.depth_interval) / 2).toFixed(2)
      //             : curr?.depth
      //             ? curr.depth
      //             : curr.depth_interval
      //
      //         prev.push([0, -depth])
      //       }
      //       return prev
      //     }, []),
      //     emphasis: {
      //       focus: 'series',
      //     },
      //   },
      // ]
    },
  },
}
</script>
