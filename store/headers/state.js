import { HEADERS_ANALYSIS, HEADERS_DRILLCORE } from '~/constants'

export const initState = () => {
  return {
    analysis: HEADERS_ANALYSIS,
    drillcore: HEADERS_DRILLCORE,
  }
}

export default initState
