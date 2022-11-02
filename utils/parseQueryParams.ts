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
    options.sortBy = (route.query.sortBy as string).split(',')
  }
  if (route.query.sortDesc) {
    options.sortDesc = (route.query.sortDesc as string)
      .split(',')
      .map((value) => value === 'true')
  }
  result.options = options
  return result
}

const parseFilterValue = (route: Route, key: string, filter: Filter) => {
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
  } else if (filter.type === FilterType.RangeAlt) {
    return route.query[key]
  } else if (filter.type === FilterType.Boolean) {
    return route.query[key] === 'true'
  } else if (filter.type === FilterType.List) {
    if (typeof route.query[key] === 'string')
      return [JSON.parse(route.query[key] as string)]
    return (route.query[key] as string[]).map((value: string) =>
      JSON.parse(value)
    )
  }
}
