import cloneDeep from 'lodash/cloneDeep'
import {
  HEADERS_ANALYSIS,
  HEADERS_ANALYTICAL_DATA,
  HEADERS_DATASET,
  HEADERS_DRILLCORE,
  HEADERS_LOCALITY,
  HEADERS_PHOTO,
  HEADERS_SAMPLE,
  HEADERS_SITE,
  HEADERS_SPECIMEN,
  HEADERS_STRATIGRAPHY,
  HEADERS_TAXON,
  HEADERS_PREPARATION,
  HEADERS_AREA,
  Headers,
} from '~/constants'
export type HeadersState = {
  analysis: Headers
  analytical_data: Headers
  area: Headers
  dataset: Headers
  drillcore: Headers
  locality: Headers
  photo: Headers
  preparation: Headers
  sample: Headers
  site: Headers
  specimen: Headers
  stratigraphy: Headers
  taxon: Headers
}

export const initState = () => {
  return {
    analysis: cloneDeep(HEADERS_ANALYSIS),
    analytical_data: cloneDeep(HEADERS_ANALYTICAL_DATA),
    area: cloneDeep(HEADERS_AREA),
    dataset: cloneDeep(HEADERS_DATASET),
    drillcore: cloneDeep(HEADERS_DRILLCORE),
    locality: cloneDeep(HEADERS_LOCALITY),
    photo: cloneDeep(HEADERS_PHOTO),
    preparation: cloneDeep(HEADERS_PREPARATION),
    sample: cloneDeep(HEADERS_SAMPLE),
    site: cloneDeep(HEADERS_SITE),
    specimen: cloneDeep(HEADERS_SPECIMEN),
    stratigraphy: cloneDeep(HEADERS_STRATIGRAPHY),
    taxon: cloneDeep(HEADERS_TAXON),
  }
}

export default initState
