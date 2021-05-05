<template>
  <div class="pa-2">
    <v-card v-if="!isLoading" flat tile>
      <v-card-text class="pb-0">
        <div class="text-body-1 font-weight-bold">
          {{ $t('statistics.analysisMethods') }}
        </div>
        <div class="d-flex flex-row flex-wrap">
          <v-checkbox
            v-for="(entity, id) in Object.keys(methods)"
            :key="id"
            class="px-3 mt-0"
            :label="entity"
            hide-details
            :indeterminate="isIndeterminate(methods[entity])"
            :value="isCheckboxChecked(methods[entity])"
            @change="handleCheckboxChange($event, methods[entity])"
          />
        </div>

        <div class="text-body-1 font-weight-bold pt-4 pb-2">
          {{ $t('statistics.activeParameters') }}
        </div>
        <v-select
          v-model="selectedParameters"
          class="parameters"
          :items="parameters"
          multiple
          chips
          deletable-chips
          clearable
          small-chips
          outlined
          :error-messages="
            selectedParameters.length === 0
              ? $t('statistics.activeParametersEmpty')
              : ''
          "
        ></v-select>
      </v-card-text>
    </v-card>

    <v-skeleton-loader v-else class="px-4" width="100%" type="paragraph" />

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
      isLoading: false,
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
      methods: [],
    }
  },
  async fetch() {
    this.isLoading = true
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
            'stats.field': [
              'depth',
              'parameter',
              'analysis_method',
              'analysis_method_en',
            ],
            'stats.calcdistinct': true,
          },
        }
      )
      this.depth = statsResponse?.stats?.stats_fields?.depth?.distinctValues
      this.parameters =
        statsResponse?.stats?.stats_fields?.parameter?.distinctValues
      const methodKey =
        this.$i18n.locale === 'en' ? 'analysis_method_en' : 'analysis_method'

      this.methods =
        statsResponse?.stats?.stats_fields?.[methodKey]?.distinctValues
      this.methods = this.methods.reduce((prev, curr) => {
        prev[curr] = [
          ...new Set(
            this.analysisResults
              .filter((item) => item[methodKey] === curr)
              .map((item) => item.parameter)
          ),
        ]
        return prev
      }, {})
      console.log(this.methods)

      this.selectedParameters = this.parameters.slice(
        0,
        this.parameters.length > 3 ? 3 : this.parameters.length
      )
    }
    this.isLoading = false
  },
  computed: {
    lineChartOptions() {
      if (
        this?.analysisResults.length > 0 &&
        this.depth?.length > 0 &&
        this.parameters?.length > 0
      ) {
        return {
          animation: false,

          title: {
            text: this.$translate({
              et: this?.localityObject?.locality,
              en: this?.localityObject?.locality_en,
            }),
            left: 'center',
            top: 45,
            textStyle: {
              fontSize: 24,
            },
          },

          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'cross',
            },
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },

          legend: {
            type: 'scroll',
            top: '90',
            padding: [5, 50],
            data: this.selectedParameters,
            selected: this.parameters.reduce((prev, curr) => {
              prev[curr] = this.selectedParameters.includes(curr)
              return prev
            }, {}),
            animationDurationUpdate: 400,
            // selectedMode: 'single',
          },

          grid: {
            show: true,
            top: 135,
            bottom: 90,
            right: '11%',
            containLabel: true,
          },

          toolbox: {
            right: 35,
            feature: {
              saveAsImage: {},
              restore: {},
              dataView: {},
              dataZoom: {},
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
            },
            {
              type: 'slider',
              show: true,
              yAxisIndex: [0, 1],
              left: '93%',
            },
            {
              type: 'inside',
              xAxisIndex: [0],
            },
          ],

          xAxis: {
            type: 'value',
            boundaryGap: false,
            data: this.depth,
            name: 'Depth',
            nameLocation: 'center',
            nameTextStyle: {
              fontWeight: 'bold',
              fontSize: 16,
            },
            nameGap: 25,
            splitNumber: 7,
          },
          yAxis: [
            {
              type: 'value',
              name: 'Value',
              nameLocation: 'center',
              nameTextStyle: {
                fontWeight: 'bold',
                fontSize: 16,
              },
              nameGap: 55,
            },
            {
              type: 'value',
              name: 'ppm',
              nameLocation: 'center',
              nameTextStyle: {
                fontWeight: 'bold',
                fontSize: 16,
              },
              nameGap: 30,
            },
          ],

          series: this.parameters.map((item) => {
            return {
              name: item,
              type: 'scatter',
              yAxisIndex: item.includes('ppm') ? 1 : 0,
              data: this.analysisResults
                .filter((result) => result.parameter === item)
                .map((t) => [t.depth, t.value]),
              symbolSize: 8,
            }
          }),
        }
      } else return {}
    },
  },
  methods: {
    isIndeterminate(params) {
      if (!this.isCheckboxChecked(params))
        return params.some((item) => this.selectedParameters.includes(item))
      else return false
    },

    isCheckboxChecked(params) {
      return params.every((item) => this.selectedParameters.includes(item))
    },

    handleCheckboxChange(bool, parameters) {
      console.log(bool)
      if (bool) {
        // this.selectedParameters = parameters
        let selected = [...this.selectedParameters]
        selected = selected.concat(parameters)
        this.selectedParameters = [...new Set(selected)]
      } else {
        this.selectedParameters = this.selectedParameters.filter(
          (item) => !parameters.includes(item)
        )
      }
    },

    handleClick(evt) {
      console.log(evt)
    },
  },
}
</script>
