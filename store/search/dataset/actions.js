import { DATASET, HEADERS_DATASET } from '~/constants'

export default {
  async searchDatasets({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'dataset',
        resource: 'dataset',
        resourceDefaults: { ...DATASET, headers: HEADERS_DATASET },
      },
      { root: true }
    )
  },
}
