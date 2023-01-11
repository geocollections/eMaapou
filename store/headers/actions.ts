import { actionTree } from 'typed-vuex'
import state from './state'
import mutations from './mutations'
export default actionTree(
  { state, mutations },
  {
    toggleHeader({ commit }, { module, headerId }) {
      commit('TOGGLE_HEADER', { module, headerId })
    },
    showHeader({ commit }, { module, headerId }) {
      commit('SHOW_HEADER', { module, headerId })
    },
    async resetHeaders({ commit, dispatch, rootState }, { module, options }) {
      const { initState } = await import(`./state`)

      const initHeaders = initState()[module as keyof typeof initState]

      commit('RESET_HEADERS', { module, initHeaders })

      if (module === 'analytical_data') {
        dispatch('addParameterHeaders', {
          parameters: rootState.search.analytical_data.parameters,
        })

        Object.values(
          rootState.search.analytical_data.parameterFilters.byIds
        ).forEach((filter: any) => {
          dispatch('showHeader', { module, headerId: filter.fields[0] })
        })
      }

      options.sortBy.forEach((headerId: string) => {
        dispatch('showHeader', { module, headerId })
      })
    },
    addParameterHeaders({ commit }, { parameters }: { parameters: any }) {
      const parameterHeaders = Object.entries(parameters).reduce(
        (prev, [key, parameter]: [string, any]) => {
          return {
            ...prev,
            [key]: {
              text: parameter.text,
              value: parameter.value,
              align: 'center',
              translate: false,
              apiFieldValue: parameter.value,
              show: false,
            },
          }
        },
        {}
      )
      commit('ADD_PARAMETER_HEADERS', {
        parameters: parameterHeaders,
        ids: Object.keys(parameters),
      })
    },
  }
)
