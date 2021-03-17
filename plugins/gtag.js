import Vue from 'vue'
import VueGtag from 'vue-gtag'

export default ({ app }) => {
  Vue.use(
    VueGtag,
    {
      config: { id: 'G-Z1LQ0S2CSS' },
    },
    app.router
  )
}
