import { joinURL } from 'ufo'
// import {} from '~image'
import { ProviderGetImage } from '@nuxt/image'
export const getImage: ProviderGetImage = (
  src: string,
  { modifiers, baseURL } = {},
  _ctx
) => {
  if (modifiers) {
    const { size } = modifiers
    return {
      url: joinURL(baseURL, size, src),
    }
  }
  return {
    url: joinURL(baseURL, src),
  }
}
