import { Plugin } from '@nuxt/types'

const plugin: Plugin = (_, inject) => {
  const formatDate = (isoDate: string): string => {
    return isoDate ? new Date(isoDate).toISOString().split('T')[0] : isoDate
  }
  inject('formatDate', formatDate)
}

export default plugin
