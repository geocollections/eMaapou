import {
  mdiMapMarkerOutline,
  mdiMapMarker,
  mdiScrewMachineFlatTop,
  mdiMapMarkerRadiusOutline,
  mdiTestTube,
  mdiChartLine,
  mdiDatabaseOutline,
  mdiEyedropper,
  mdiFamilyTree,
  mdiLayersTriple,
  mdiFileImageOutline,
  mdiImageFilterHdr,
  mdiBug,
} from '@mdi/js'

export const BROWSE_GEOLOGY_LIST = [
  {
    routeName: 'locality',
    label: 'locality.pageTitle',
    icon: mdiMapMarker,
  },
  {
    routeName: 'site',
    label: 'site.pageTitle',
    icon: mdiMapMarkerOutline,
  },
  {
    routeName: 'area',
    label: 'area.pageTitle',
    icon: mdiMapMarkerRadiusOutline,
  },
  {
    routeName: 'drillcore',
    label: 'drillcore.pageTitle',
    icon: mdiScrewMachineFlatTop,
  },
]

export const BROWSE_LAB_LIST = [
  {
    routeName: 'sample',
    label: 'sample.pageTitle',
    icon: mdiImageFilterHdr,
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
    routeName: 'analysis',
    label: 'analysis.pageTitle',
    icon: mdiTestTube,
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
    icon: mdiBug,
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
