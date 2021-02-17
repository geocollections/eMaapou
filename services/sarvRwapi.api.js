const RWAPI_URL = 'https://rwapi.geocollections.info'

export default ($axios) => ({
  async isLoggedIn() {
    const response = await $axios.get(`${RWAPI_URL}/is_logged_in/login_state`)
    return response.data
  },
})
