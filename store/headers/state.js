import {
  HEADERS_ANALYSIS,
  // HEADERS_ANALYTICAL_DATA,
  HEADERS_DATASET,
  HEADERS_DRILLCORE,
  HEADERS_LOCALITY,
  HEADERS_PHOTO,
  HEADERS_SAMPLE,
  HEADERS_SITE,
  HEADERS_SPECIMEN,
  HEADERS_STRATIGRAPHY,
  HEADERS_TAXON,
} from '~/constants'

export const initState = () => {
  return {
    analysis: HEADERS_ANALYSIS,
    // analytical_data: HEADERS_ANALYTICAL_DATA,
    dataset: HEADERS_DATASET,
    drillcore: HEADERS_DRILLCORE,
    locality: HEADERS_LOCALITY,
    photo: HEADERS_PHOTO,
    sample: HEADERS_SAMPLE,
    site: HEADERS_SITE,
    specimen: HEADERS_SPECIMEN,
    stratigraphy: HEADERS_STRATIGRAPHY,
    taxon: HEADERS_TAXON,
  }
}

export default initState
