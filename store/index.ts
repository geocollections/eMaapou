import { getAccessorType } from 'typed-vuex'

// Import all your submodules
// import actions from './search/actions'
// import { initState } from './search/state'
// import getters from './search/getters'
// import mutations from './search/mutations'
import * as settings from '~/store/settings'
import * as history from '~/store/history'
import * as map from '~/store/map'
import * as chart from '~/store/chart'
import search from '~/store/search'
import headers from '~/store/headers'
// Keep your existing vanilla Vuex code for state, getters, mutations, actions, plugins, etc.
// ...

// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({
  namespaced: true,
  modules: {
    // The key (submodule) needs to match the Nuxt namespace (e.g. ~/store/submodule.ts)
    chart,
    history,
    headers,
    map,
    search,
    settings,
    // search: {
    //   actions,
    //   getters,
    //   mutations,
    //   state: initState,
    // },
  },
})
