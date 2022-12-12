import { Plugin } from '@nuxt/types'
import { writeFileXLSX, utils } from 'xlsx'

// NOTE: Importing anything from `xlsx` in a component that is on the same page with a map,
// results in `leaflet` being copied into every bundle.
// Current solution was to use the app vendor bundle to import necessary `xlsx` funcionality
const plugin: Plugin = (_, inject) => {
  inject('writeFileXLSX', writeFileXLSX)
  inject('xlsxUtils', utils)
}

export default plugin
