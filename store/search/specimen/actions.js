import { SPECIMEN } from '~/constants'

export default {
  async searchSpecimens({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'specimen',
        resource: 'specimen',
        resourceDefaults: SPECIMEN,
      },
      { root: true }
    )
  },
}
