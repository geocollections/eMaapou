import {
  HEADERS_ANALYSIS,
  HEADERS_ANALYTICAL_DATA,
  HEADERS_DRILLCORE,
} from '~/constants'

export const initState = () => {
  return {
    analysis: HEADERS_ANALYSIS,
    analytical_data: HEADERS_ANALYTICAL_DATA,
    drillcore: HEADERS_DRILLCORE,
  }
}

export default initState
