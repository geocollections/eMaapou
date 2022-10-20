import { Plugin } from '@nuxt/types'
import slugify from 'slugify'
import { Route } from 'vue-router'

const plugin: Plugin = ({ localeRoute, getRouteBaseName }, inject) => {
  const createSlugRoute = (route: Route, text: string): Route | undefined => {
    return localeRoute({
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
