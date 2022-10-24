import {
  mdiMapMarkerOutline,
  mdiScrewMachineFlatTop,
  mdiMapMarkerRadiusOutline,
  mdiBinoculars,
  mdiTestTube,
  mdiChartScatterPlot,
  mdiChartLine,
  mdiDatabaseOutline,
  mdiEyedropper,
  mdiMicroscope,
  mdiFamilyTree,
  mdiLayersTriple,
  mdiFileImageOutline,
} from '@mdi/js'

export const BROWSE_GEOLOGY_LIST = [
  {
    routeName: 'locality',
    label: 'locality.pageTitle',
    icon: mdiMapMarkerOutline,
  },
  {
    routeName: 'drillcore',
    label: 'drillcore.pageTitle',
    icon: mdiScrewMachineFlatTop,
  },
  {
    routeName: 'area',
    label: 'area.pageTitle',
    icon: mdiMapMarkerRadiusOutline,
  },
  {
    routeName: 'site',
    label: 'site.pageTitle',
    icon: mdiBinoculars,
  },
]

export const BROWSE_LAB_LIST = [
  {
    routeName: 'sample',
    label: 'sample.pageTitle',
    icon: mdiTestTube,
  },
  {
    routeName: 'analysis',
    label: 'analysis.pageTitle',
    icon: mdiChartScatterPlot,
  },
  {
    routeName: 'analytical-data',
    label: 'analyticalData.pageTitle',
    icon: mdiChartLine,
  },
  {
    routeName: 'dataset',
    label: 'dataset.pageTitle',
    icon: mdiDatabaseOutline,
  },
  {
    routeName: 'preparation',
    label: 'preparation.pageTitle',
    icon: mdiEyedropper,
  },
]

export const BROWSE_TAXON_LIST = [
  {
    routeName: 'specimen',
    label: 'specimen.pageTitle',
    icon: mdiMicroscope,
  },
  {
    routeName: 'taxon',
    label: 'taxon.pageTitle',
    icon: mdiFamilyTree,
  },
  {
    routeName: 'stratigraphy',
    label: 'stratigraphy.pageTitle',
    icon: mdiLayersTriple,
  },
  {
    routeName: 'photo',
    label: 'photo.pageTitle',
    icon: mdiFileImageOutline,
  },
]

export const BROWSE_PHOTO = {
  routeName: 'photo',
  text: 'photo.pageTitle',
  icon: mdiFileImageOutline,
}
