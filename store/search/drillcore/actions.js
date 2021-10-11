import { DRILLCORE, HEADERS_DRILLCORE } from '~/constants'

export default {
  async searchDrillcores({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'drillcore',
        resource: 'drillcore',
        resourceDefaults: { ...DRILLCORE, headers: HEADERS_DRILLCORE },
      },
      { root: true }
    )
  },
}
