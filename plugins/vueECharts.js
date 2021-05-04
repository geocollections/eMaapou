import Vue from 'vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

// import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
  LegendComponent,
  TooltipComponent,
  TitleComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
  VisualMapComponent,
  BrushComponent,
} from 'echarts/components'

use([
  // renderers
  CanvasRenderer,

  // charts
  LineChart,
  BarChart,

  // components
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,
  BrushComponent,
])

// register globally (or you can do it locally)
Vue.component('VChart', ECharts)
