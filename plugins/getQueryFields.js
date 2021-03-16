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

  inject('getQueryFields', getQueryFields)
}
