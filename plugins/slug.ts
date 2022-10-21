import { Plugin } from '@nuxt/types'
import slugify from 'slugify'
import { Route, Location } from 'vue-router'

const plugin: Plugin = ({ localeLocation, getRouteBaseName }, inject) => {
  const createSlugRoute = (
    route: Route,
    text: string
  ): Location | undefined => {
    return localeLocation({
      ...route,
      name: getRouteBaseName()?.includes('-slug')
        ? getRouteBaseName()
        : `${getRouteBaseName()}-slug`,
      params: {
        ...route.params,
        slug: slugify(text, { lower: true }),
      },
    })
  }
  inject('createSlugRoute', createSlugRoute)
}

export default plugin
