import { Plugin } from '@nuxt/types'

interface ITranslations {
  et: string
  en: string
}

const plugin: Plugin = ({ i18n }, inject) => {
  const translate = (translations: ITranslations): string => {
    return i18n.locale === 'et'
      ? translations.et
      : translations.en ?? translations.et
  }
  inject('translate', translate)
}

export default plugin
