import { Plugin } from '@nuxt/types'
import generateServices from '~/services'
const plugin: Plugin = (context, inject) => {
  inject('services', generateServices(context))
}

export default plugin
