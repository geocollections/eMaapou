<template>
  <div class="pa-2">
    <client-only>
      <chart-wrapper :options="lineChartOptions" @click="handleClick" />
    </client-only>
  </div>
</template>

<script>
import { isNil } from 'lodash'
import ChartWrapper from '~/components/ChartWrapper'
export default {
  components: { ChartWrapper },
  props: {
    locality: {
      type: Number,
      default: null,
    },
    localityObject: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      analysisResults: [],
      depth: [],
      count: 0,
      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
      },
      parameters: [],
      selectedParameters: [],
    }
  },
  async fetch() {
    if (this.analysisResults.length === 0) {
      const analysisResultsResponse = await this.$services.sarvSolr.getResourceList(
        'analysis_results',
        {
          useRawSolr: true,
          isValid: isNil(this.locality),
          defaultParams: {
            fq: `locality_id:${this.locality}`,
            start: 0,
            rows: 50000,
            fl:
              'id,analysis_id,depth,depth_interval,parameter,analysis_method,analysis_method_en,value',
          },
        }
      )
      this.analysisResults = analysisResultsResponse?.items

      const statsResponse = await this.$services.sarvSolr.getResourceList(
        'analysis_results',
        {
          useRawSolr: true,
          isValid: isNil(this.locality),
          defaultParams: {
            fq: `locality_id:${this.locality}`,
            rows: 0,
            fl: 'depth',
            sort: 'depth asc, parameter asc',
            stats: 'on',
            'stats.field': ['depth', 'parameter'],
            'stats.calcdistinct': true,
          },
        }
      )
      this.depth = statsResponse?.stats?.stats_fields?.depth?.distinctValues
      this.parameters =
        statsResponse?.stats?.stats_fields?.parameter?.distinctValues

      this.selectedParameters = [
        this.parameters[0],
        this.parameters[1],
        this.parameters[2],
      ]
    }
  },
  computed: {
    lineChartOptions() {
      if (
        this?.analysisResults.length > 0 &&
        this.depth?.length > 0 &&
        this.parameters?.length > 0
      ) {
        return {
          title: {
            text: this.$translate({
              et: this?.localityObject?.locality,
              en: this?.localityObject?.locality_en,
            }),
            left: 'center',
            top: 45,
            textStyle: {
              fontSize: 22,
            },
          },
          // visualMap: {
          //   orient: 'vertical',
          // },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            type: 'scroll',
            top: '90',
            padding: [5, 50],
            data: this.parameters,
            selected: this.selectedParameters,
            animationDurationUpdate: 400,
          },
          grid: {
            show: true,
            top: 135,
            containLabel: true,
          },
          toolbox: {
            // orient: 'vertical',
            right: 35,
            feature: {
              saveAsImage: {},
              restore: {},
              dataView: {},
              dataZoom: {},
              magicType: {
                type: ['line', 'bar', 'stack'],
              },
              brush: {},
            },
          },
          brush: {
            toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              // start: 1,
              // end: 35,
            },
            {
              type: 'slider',
              show: true,
              yAxisIndex: [0],
              left: '93%',
              // start: 29,
              // end: 36,
            },
            {
              type: 'inside',
              xAxisIndex: [0],
              // start: 1,
              // end: 35,
            },
            {
              type: 'inside',
              yAxisIndex: [0],
              // start: 29,
              // end: 36,
            },
          ],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.depth,
          },
          yAxis: {
            type: 'value',
          },
          series: this.parameters.map((item) => {
            return {
              name: item,
              type: 'line',
              stack: this.analysisResults.find(
                (result) => result.parameter === item
              ).analysis_method,
              data: this.analysisResults
                .filter((result) => result.parameter === item)
                .map((t) => t.value),
            }
          }),
        }
      } else return {}
    },
  },
  methods: {
    handleClick(evt) {
      console.log(evt)
    },
  },
}
</script>
