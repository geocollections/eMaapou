import { HEADERS_PREPARATION, PREPARATION } from '~/constants'

export default {
  async searchPreparations({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'preparation',
        resource: 'preparation',
        resourceDefaults: { ...PREPARATION, headers: HEADERS_PREPARATION },
      },
      { root: true }
    )
  },
}
