import { HEADERS_SITE, SITE } from '~/constants'

export default {
  async searchSites({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'site',
        resource: 'site',
        resourceDefaults: { ...SITE, headers: HEADERS_SITE },
      },
      { root: true }
    )
  },
}
