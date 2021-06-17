import { TAXON } from '~/constants'

export default {
  async searchTaxa({ dispatch }, options = null) {
    await dispatch(
      'search/searchResource',
      {
        ...(options && { options }),
        module: 'taxon',
        resource: 'taxon_search',
        resourceDefaults: TAXON,
      },
      { root: true }
    )
  },
}
