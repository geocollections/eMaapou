export const state = () => ({
  cookiePolicy: true,
})

export const actions = {
  closeCookiePolicy({ commit }) {
    commit('CLOSE_COOKIE_POLICY')
  },
}

export const mutations = {
  CLOSE_COOKIE_POLICY(state) {
    state.cookiePolicy = false
  },
}
