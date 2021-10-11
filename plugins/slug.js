import slugify from 'slugify'

export default ({ localeRoute, getRouteBaseName }, inject) => {
  const createSlugRoute = (route, text) => {
    return localeRoute({
      ...route,
      name: getRouteBaseName().includes('-slug')
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
