export default ({ app }, inject) => {
  const getQueryFields = (queryFields) => {
    return Object.keys(queryFields).reduce(
      (o, field) => ({
        ...o,
        [field]: queryFields[field](app.i18n.locale),
      }),
      {}
    )
  }

  const getSortValues = (headers) => {
    return Object.entries(headers.byIds).reduce((o, [headerKey, header]) => {
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

  inject('getQueryFields', getQueryFields)
  inject('getSortValues', getSortValues)
}
