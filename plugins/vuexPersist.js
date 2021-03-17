import VuexPersistence from 'vuex-persist'

const vuexOptions = {
  key: 'eMaapou',
  reducer: (state) => ({
    settings: {
      cookiePolicy: state.settings.cookiePolicy,
    },
    i18n: { locale: state.i18n.locale },
  }),
}

export default ({ store }) => {
  new VuexPersistence(vuexOptions).plugin(store)
}
