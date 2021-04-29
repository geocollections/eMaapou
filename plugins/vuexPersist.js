import VuexPersistence from 'vuex-persist'

const vuexOptions = {
  key: 'eMaapou',
  reducer: (state) => ({
    settings: {
      cookiePolicy: state.settings.cookiePolicy,
      showSearchViewMap: state.settings.showSearchViewMap,
      showSearchViewForm: state.settings.showSearchViewForm,
    },
    history: {
      ...state.history,
    },
  }),
}

export default ({ store }) => {
  new VuexPersistence(vuexOptions).plugin(store)
}
