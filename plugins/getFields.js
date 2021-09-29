export default ({ app }, inject) => {
  const getFields = (headers) => {
    return Object.entries(headers.byIds)
      .filter(([headerKey, header]) => {
        return header.sortValue
      })
      .reduce((o, [headerKey, header]) => {
        let sortValue = ''
        if (typeof header.sortValue === 'string') sortValue = header.sortValue
        if (typeof header.sortValue === 'object')
          sortValue = header.sortValue[app.i18n.locale]

        return {
          ...o,
          [headerKey]: sortValue,
        }
      }, {})
  }

  inject('getFields', getFields)
}
