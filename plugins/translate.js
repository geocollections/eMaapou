export default ({ app }, inject) => {
  const translate = (translations) => {
    return app.i18n.locale === 'et' ? translations.et : translations.en
  }
  inject('translate', translate)
}
