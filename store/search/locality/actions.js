import { LOCALITY } from '~/constants'

export default {
  async searchLocalities({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'locality',
        resource: 'locality',
        resourceDefaults: LOCALITY,
      },
      { root: true }
    )
  },
}
