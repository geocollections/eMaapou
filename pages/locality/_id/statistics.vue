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
      this.analysisResults = analysisResultsResponse?.items.map((item) => {
        return {
          ...item,
          calculatedDepth:
            item.depth && item.depth_interval
              ? ((item.depth + item.depth_interval) / 2).toFixed(2)
              : item.depth,
        }
      })

      this.parameters = [
        ...new Set(this.analysisResults.map((item) => item.parameter)),
      ]

      this.selectedParameters = [
        this.parameters[0],
        this.parameters[1],
        this.parameters[2],
      ]
    }
  },
  computed: {
    lineChartOptions() {
      if (this.analysisResults && this.analysisResults.length > 0) {
        return {
          title: {
            text: this.$translate({
              et: this?.localityObject?.locality,
              en: this?.localityObject?.locality_en,
            }),
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            type: 'scroll',
            top: '25',
            padding: [5, 50],
            data: this.parameters,
            selected: this.selectedParameters,
            animationDurationUpdate: 400,
          },
          grid: {
            containLabel: true,
          },
          toolbox: {
            feature: {
              saveAsImage: {},
              restore: {},
              dataZoom: {},
              magicType: {},
              brush: {},
            },
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [
              ...new Set(
                this.analysisResults.map((item) => item.calculatedDepth)
              ),
            ].sort(),
          },
          yAxis: {
            type: 'value',
          },
          series: [
            ...new Set(this.analysisResults.map((item) => item.parameter)),
          ].map((item) => {
            return {
              name: item,
              test: 'te',
              type: 'line',
              stack: 'test',
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
