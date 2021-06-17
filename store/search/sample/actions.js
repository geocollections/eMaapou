import { SAMPLE } from '~/constants'

export default {
  async searchSamples({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'sample',
        resource: 'sample',
        resourceDefaults: SAMPLE,
      },
      { root: true }
    )
  },
}
