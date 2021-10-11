import { AREA, HEADERS_AREA } from '~/constants'

export default {
  async searchAreas({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'area',
        resource: 'area',
        resourceDefaults: { ...AREA, headers: HEADERS_AREA },
      },
      { root: true }
    )
  },
}
