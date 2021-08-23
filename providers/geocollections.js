import { joinURL } from 'ufo'
// import {} from '~image'

export function getImage(
  src,
  { modifiers, baseURL } = {},
  { options, nuxtContext, $img }
) {
  // eslint-disable-next-line no-unused-vars
  const { width, height, format, fit, size, ...providerModifiers } = modifiers
  const operations = []
  // process modifiers
  const operationsString = operations.join(',')
  return {
    url: joinURL(baseURL, size, operationsString, src),
  }
}
