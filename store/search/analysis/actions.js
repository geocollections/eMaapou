import { ANALYSIS, HEADERS_ANALYSIS } from '~/constants'

export default {
  async searchAnalyses({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'analysis',
        resource: 'analysis',
        resourceDefaults: { ...ANALYSIS, headers: HEADERS_ANALYSIS },
      },
      { root: true }
    )
  },
}
