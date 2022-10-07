import Vue from 'vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

// import ECharts modules manually to reduce bundle size
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import {
  BarChart,
  LineChart,
  ScatterChart,
  PieChart,
  CustomChart,
} from 'echarts/charts'
import {
  LegendComponent,
  TooltipComponent,
  TitleComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
  BrushComponent,
  DatasetComponent,
} from 'echarts/components'

use([
  // renderers
  CanvasRenderer,
  SVGRenderer,

  // charts
  LineChart,
  BarChart,
  ScatterChart,
  PieChart,
  CustomChart,

  // components
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent,
  BrushComponent,
  DatasetComponent,
])

// register globally (or you can do it locally)
Vue.component('VChart', ECharts)
