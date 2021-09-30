export default ({ app }, inject) => {
  const getAPIFieldValues = (headers) => {
    return Object.entries(headers.byIds)
      .filter(([headerKey, header]) => {
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
