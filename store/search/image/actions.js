import { IMAGE } from '~/constants'

export default {
  async searchImages({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'image',
        resource: 'attachment',
        resourceDefaults: IMAGE,
      },
      { root: true }
    )
  },
}
