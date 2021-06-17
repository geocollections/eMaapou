import { ANALYSIS } from '~/constants'

export default {
  async searchAnalyses({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'analysis',
        resource: 'analysis',
        resourceDefaults: ANALYSIS,
      },
      { root: true }
    )
  },
}
