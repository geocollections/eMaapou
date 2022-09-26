<template>
  <v-fade-transition hide-on-leave mode="out-in">
    <div
      v-if="isLoading"
      key="flog-loading"
      class="d-flex align-center justify-center"
      style="height: 500px; width: 100%"
    >
      <v-progress-circular indeterminate color="accent" :size="100" />
    </div>
    <div v-else key="flog-chart" class="pa-2">
      <div class="mb-2">
        <options-method-tree-view
          :methods="methods"
          :initial-selection="selectedParameters"
          @input="handleMethodsUpdate"
        />
      </div>
      <div class="mb-2 d-flex flex-row flex-wrap">
        <renderer-switch
          class="mr-2"
          :renderer="renderer"
          @update="renderer = $event"
        />

        <connection-switch
          :input-value="connected"
          @change="connected = $event"
        />
      </div>

      <!-- Todo: Review all chart wrappers and limit it to only one wrapper -->

      <div class="charts d-flex flex-row">
        <!-- Todo: Stratigraphy chart -->
        <!-- Disabled as it's not ready yet -->
        <!-- <stratigraphy-chart
          v-if="stratigraphyResults.length > 0 && false"
          :results="stratigraphyResults"
        /> -->
        <sample-chart
          v-if="samples.length > 0"
          :results="samples"
          :chart-title="$t('sampleChart.title')"
          :y-min="minDepth"
          :y-max="maxDepth"
        />

        <div v-if="analyses.length > 0" class="d-flex flex-row">
          <params-chart
            v-for="(param, index) in selectedParameters"
            :key="index"
            :results="
              analyses.filter((result) => result.parameter === param.name)
            "
            :param="param.name"
            :chart-title="param.name"
            :y-min="minDepth"
            :y-max="maxDepth"
          />
        </div>

        <!-- <taxa-chart
          v-if="taxaResults.length > 0 && selectedTaxa.length > 0 && false"
          class="d-flex flex-row"
          :results="taxaResults"
          :taxa="selectedTaxa"
          :min-depth="minDepth"
          :max-depth="maxDepth"
        /> -->
      </div>
    </div>
  </v-fade-transition>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import RendererSwitch from '~/components/chart/options/RendererSwitch'
import ConnectionSwitch from '~/components/chart/options/ConnectionSwitch'
import SampleChart from '~/components/chart/types/SampleChart'
import ParamsChart from '~/components/chart/types/ParamsChart'
import OptionsMethodTreeView from '~/components/chart/options/OptionsMethodTreeView.vue'
export default {
  components: {
    ParamsChart,
    SampleChart,
    ConnectionSwitch,
    RendererSwitch,
    OptionsMethodTreeView,
  },
  props: {
    analyses: {
      type: Array,
      default: () => [],
    },
    samples: {
      type: Array,
      default: () => [],
    },
    minDepth: {
      type: Number,
      required: true,
    },
    maxDepth: {
      type: Number,
      required: true,
    },
    methods: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      // Results
      stratigraphyResults: [],
      taxaResults: [],
      // Analysis
      selectedParameters: [],
      // Taxa
      taxa: [],
      selectedTaxa: [],
      initSelectedTaxa: [],
    }
  },
  computed: {
    ...mapFields('chart', ['renderer', 'connected']),
  },
  created() {
    // Set initial selected parameters
    if (this.methods.length > 0) {
      this.selectedParameters = this.methods[0].children.slice(
        0,
        this.methods[0].children.length > 3
          ? 3
          : this.methods[0].children.length
      )
    }
  },
  methods: {
    handleMethodsUpdate(event) {
      this.selectedParameters = event
    },
  },
}
</script>

<style lang="scss">
.charts {
  overflow-x: auto;
}
</style>
