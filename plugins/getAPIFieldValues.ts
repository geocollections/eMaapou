import { Plugin } from '@nuxt/types'

const plugin: Plugin = ({ app }, inject) => {
  const getAPIFieldValues = (headers: {
    byIds: { [key: string]: any }
    allIds: string[]
  }): { [key: string]: string } => {
    return Object.entries(headers.byIds)
      .filter(([_, header]) => {
        return header.apiFieldValue
      })
      .reduce((o, [headerKey, header]) => {
        let apiFieldValue = ''
        if (typeof header.apiFieldValue === 'string')
          apiFieldValue = header.apiFieldValue
        if (typeof header.apiFieldValue === 'object')
          apiFieldValue = header.apiFieldValue[app.i18n.locale]

        return {
          ...o,
          [headerKey]: apiFieldValue,
        }
      }, {})
  }

  inject('getAPIFieldValues', getAPIFieldValues)
}

export default plugin
