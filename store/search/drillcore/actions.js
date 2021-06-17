import { DRILLCORE } from '~/constants'

export default {
  async searchDrillcores({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'drillcore',
        resource: 'drillcore',
        resourceDefaults: DRILLCORE,
      },
      { root: true }
    )
  },
}
