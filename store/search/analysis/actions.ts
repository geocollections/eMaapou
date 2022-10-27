import { actionTree } from 'typed-vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import { ANALYSIS, HEADERS_ANALYSIS } from '~/constants'
import { IOptions } from '~/services'
export default actionTree(
  { state, getters, mutations },
  {
    async searchAnalyses({ dispatch }, options: IOptions | null = null) {
      await dispatch(
        'search/searchResource',
        {
          ...(options && { options }),
          module: 'analysis',
          resource: 'analysis',
          resourceDefaults: { ...ANALYSIS, headers: HEADERS_ANALYSIS },
        },
        { root: true }
      )
    },
  }
)
