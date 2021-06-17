import { STRATIGRAPHY } from '~/constants'

export default {
  async searchStratigraphies({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'stratigraphy',
        resource: 'stratigraphy',
        resourceDefaults: STRATIGRAPHY,
      },
      { root: true }
    )
  },
}
