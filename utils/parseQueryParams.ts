import type { Route } from 'vue-router'
import { IOptions } from '~/services'
import { SearchState } from '~/store/search/state'
import { FilterType } from '~/types/enums'
import { Filter } from '~/types/filters'

export default function <Filters extends string | number | symbol>({
  route,
  filters,
  globalFilters,
  qKey,
}: {
  route: Route
  filters?: { [K in Filters]: Filter }
  globalFilters?: { [K in keyof SearchState['globalFilters']]?: Filter }
  qKey: string
}) {
  const result = { query: '' } as {
    query: string
    filters?: { [K in Filters]?: Filter }
    globalFilters?: { [K in keyof SearchState['globalFilters']]?: Filter }
    options: IOptions
  }
  result.query = (route.query[qKey] as string) ?? ''
  if (filters) {
    result.filters = Object.entries<Filter>(filters)
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
      .reduce(
        (
          prev,
          [key, filter]
        ): { [K in keyof SearchState['globalFilters']]?: any } => {
          return {
            ...prev,
            [key]: parseFilterValue(route, key, filter as Filter),
          }
        },
        {}
      )
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
    return [
      start !== '*' ? Number(start) : null,
      end !== '*' ? Number(end) : null,
    ]
  } else if (filter.type === FilterType.Geom) {
    return JSON.parse(route.query[key] as string)
  } else if (filter.type === FilterType.Object) {
    return JSON.parse(route.query[key] as string)
  } else if (filter.type === FilterType.ListOr) {
    if (typeof route.query[key] === 'string') return [route.query[key]]
    return route.query[key]
  } else if (filter.type === FilterType.RangeAlt) {
    if (filter.value.length < 1) {
      return (route.query[key] as string).split(',')
    }
    return filter.value
  } else if (filter.type === FilterType.Boolean) {
    return route.query[key] === 'true'
  } else if (filter.type === FilterType.List) {
    if (typeof route.query[key] === 'string')
      return [JSON.parse(route.query[key] as string)]
    return (route.query[key] as string[]).map((value: string) =>
      JSON.parse(value)
    )
  } else if (filter.type === FilterType.ListIds) {
    if (filter.value.length < 1)
      return (route.query[key] as string).split(',').map((queryValue) => ({
        [filter.valueField]: decodeURIComponent(queryValue),
      }))
    return filter.value
  } else if (filter.type === FilterType.ListText) {
    if (filter.value.length < 1)
      return (route.query[key] as string)
        .split(',')
        .map((val) => decodeURIComponent(val))
    return filter.value
  } else if (filter.type === FilterType.Parameter) {
    return (route.query[key] as string).split(',').map((val) => {
      const [parameter, valueStr] = val.split(':')
      const [start, end] = valueStr.split('-')
      return {
        parameter,
        value: [
          start !== '*' ? Number(start) : null,
          end !== '*' ? Number(end) : null,
        ],
      }
    })
  } else if (filter.type === FilterType.ListDate) {
    return (route.query[key] as string).split(',').map((val) => {
      return val.split('~')
    })
  }
}
