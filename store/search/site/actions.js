import { SITE } from '~/constants'

export default {
  async searchSites({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'site',
        resource: 'site',
        resourceDefaults: SITE,
      },
      { root: true }
    )
  },
}
