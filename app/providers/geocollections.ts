import { defineProvider } from '@nuxt/image/runtime'
import { joinURL } from 'ufo'

export default defineProvider<{ baseURL?: string }>({
  getImage(src, { modifiers = {}, baseURL = '' }) {
    const size = modifiers.size

    return {
      url: size
        ? joinURL(baseURL, String(size), src)
        : joinURL(baseURL, src),
    }
  },
})