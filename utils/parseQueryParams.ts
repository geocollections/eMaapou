import type { Route } from 'vue-router'
import { IOptions } from '~/services'
import { FilterType } from '~/types/enums'
import { Filter } from '~/types/filters'

export default ({
  route,
  filters,
  globalFilters,
  qKey,
}: {
  route: Route
  filters?: { [K: string]: Filter }
  globalFilters?: { [K: string]: Filter }
  qKey: string
}) => {
  const result = { query: '' } as {
    query: string
    filters?: { [K: string]: Filter }
    globalFilters?: { [K: string]: Filter }
    options: IOptions
  }
  result.query = (route.query[qKey] as string) ?? ''
  if (filters) {
    result.filters = Object.entries(filters)
      .filter(([key, _]) => route.query[key])
      .reduce((prev, [key, filter]): { [K: string]: any } => {
        return {
          ...prev,
          [key]: parseFilterValue(route, key, filter),
        }
      }, {})
  }
  if (globalFilters) {
    result.globalFilters = Object.entries(globalFilters)
      .filter(([key, _]) => route.query[key])
      .reduce((prev, [key, filter]): { [K: string]: any } => {
        return {
          ...prev,
          [key]: parseFilterValue(route, key, filter),
        }
      }, {})
  }
  const options: any = {}
  if (route.query.page) {
    options.page = parseInt(route.query.page as string)
  }
  if (route.query.itemsPerPage) {
    options.itemsPerPage = parseInt(route.query.itemsPerPage as string)
  }
  if (route.query.sortBy) {
    options.sortBy = Array.isArray(route.query.sortBy)
      ? route.query.sortBy
      : [route.query.sortBy]
  }
  if (route.query.sortDesc) {
    options.sortDesc = Array.isArray(route.query.sortDesc)
      ? route.query.sortDesc
      : [route.query.sortDesc]
  }
  result.options = options
  return result
}

const parseFilterValue = (route: Route, key: string, filter: Filter): any => {
  if (filter.type === FilterType.Text) {
    return route.query[key] as string
  } else if (filter.type === FilterType.Range) {
    const [start, end] = (route.query[key] as string)?.split('-') ?? [
      null,
      null,
    ]
    return [start !== '*' ? start : null, end !== '*' ? end : null]
  } else if (filter.type === FilterType.Geom) {
    return JSON.parse(route.query[key] as string)
  } else if (filter.type === FilterType.Object) {
    return JSON.parse(route.query[key] as string)
  } else if (filter.type === FilterType.ListOr) {
    return route.query[key]
  }
}
