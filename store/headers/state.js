import {
  HEADERS_ANALYSIS,
  HEADERS_ANALYTICAL_DATA,
  HEADERS_DATASET,
  HEADERS_DRILLCORE,
  HEADERS_LOCALITY,
} from '~/constants'

export const initState = () => {
  return {
    analysis: HEADERS_ANALYSIS,
    analytical_data: HEADERS_ANALYTICAL_DATA,
    dataset: HEADERS_DATASET,
    drillcore: HEADERS_DRILLCORE,
    locality: HEADERS_LOCALITY,
  }
}

export default initState
