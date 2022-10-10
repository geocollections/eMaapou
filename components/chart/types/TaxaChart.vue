<template>
  <div>
    <taxa-chart-wrapper
      v-for="(item, index) in taxa"
      :key="index"
      :options="optionsUsingTaxon(item)"
    />
  </div>
</template>

<script>
import TaxaChartWrapper from '~/components/chart/wrappers/TaxaChartWrapper.vue'

export default {
  name: 'TaxaChart',
  components: { TaxaChartWrapper },
  props: {
    chartTitle: {
      type: String,
      required: false,
      default: 'Taxa',
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
          fontSize: 10,
          // margin: 13,
          padding: [13, 0, 0, 0],
          // rotate: 90,
          // inside: true,
          // align: 'right',
          // margin: 17,
        },
        axisLine: {
          show: true,
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
              return `<span class="mr-2" style="display: inline-block; width: 10px; height: 10px; border-radius: 10px; background-color: ${params.color}"></span><span>${params.data.taxon}
                    <br />Frequency: <b>${params.data.name}</b></span>\
                    <br />Depth: <b>${params.data.sampleDepth}</b></span>
                    <br /><span>Depth interval: <b>${params.data.sampleDepthInterval}</b></span>`
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

              const maxSymbolSize = 20
              const minSymbolSize = 5
              const maxFrequency = 404 // Highest number from solr index (one is 1856 but this is an exception)

              const symbolSizeInPercent = (curr.frequency * 100) / maxFrequency
              let symbolSize = Math.round(
                (maxSymbolSize * symbolSizeInPercent) / 100 + minSymbolSize
              )
              symbolSize =
                symbolSize > 20 ? 20 : symbolSize < 7 ? 7 : symbolSize

              prev.push({
                sampleDepth: -curr.depth,
                sampleDepthInterval: -curr.depth_interval,
                taxon: curr.taxon,
                taxonId: curr.taxon_id,
                mySize: symbolSize,
                name: curr.frequency,
                symbol: 'rect',
                symbolSize,
                value: [0, -depth],
                label: {
                  show: true,
                  position: 'right',
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
    },
  },
}
</script>
