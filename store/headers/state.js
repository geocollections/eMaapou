import {
  HEADERS_ANALYSIS,
  HEADERS_ANALYTICAL_DATA,
  HEADERS_DATASET,
  HEADERS_DRILLCORE,
  HEADERS_LOCALITY,
  HEADERS_PHOTO,
  HEADERS_SAMPLE,
} from '~/constants'

export const initState = () => {
  return {
    analysis: HEADERS_ANALYSIS,
    analytical_data: HEADERS_ANALYTICAL_DATA,
    dataset: HEADERS_DATASET,
    drillcore: HEADERS_DRILLCORE,
    locality: HEADERS_LOCALITY,
    photo: HEADERS_PHOTO,
    sample: HEADERS_SAMPLE,
  }
}

export default initState
