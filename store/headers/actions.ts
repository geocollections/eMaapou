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
    async resetHeaders(
      { commit, dispatch },
      { module, options }
    ): Promise<void> {
      const { initState } = await import(`./state`)

      const initHeaders = initState()[module as keyof typeof initState]

      // if (module !== 'analytical_data')
      commit('RESET_HEADERS', { module, initHeaders })

      if (module === 'analytical_data') {
        this.app.$accessor.headers.addParameterHeaders({
          parameters: this.app.$accessor.search.analyticalData.parameters,
        })

        this.app.$accessor.search.analyticalData.filters.parameter.value.forEach(
          (filter: any) => {
            dispatch('showHeader', { module, headerId: filter.parameter })
          }
        )
      }

      options.sortBy.forEach((headerId: string) => {
        dispatch('showHeader', { module, headerId })
      })
    },
    setAnalyticalDataParameterHeader({ dispatch }, { options }): void {
      this.app.$accessor.headers.addParameterHeaders({
        parameters: this.app.$accessor.search.analyticalData.parameters,
      })

      this.app.$accessor.search.analyticalData.filters.parameter.value.forEach(
        (filter: any) => {
          if (filter.parameter !== null)
            dispatch('showHeader', {
              module: 'analytical_data',
              headerId: filter.parameter,
            })
        }
      )
      options.sortBy.forEach((headerId: string) => {
        dispatch('showHeader', { module: 'analytical_data', headerId })
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
