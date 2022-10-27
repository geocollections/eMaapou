import type { Route } from 'vue-router'
import { IOptions } from '~/services'
import { FilterType } from '~/types/enums'
import { Filter } from '~/types/filters'

export default (
  route: Route,
  filters: { [K: string]: Filter },
  qKey: string
) => {
  const result = { query: '' } as {
    query: string
    filters?: { [K: string]: Filter }
    options: IOptions
  }
  result.query = (route.query[qKey] as string) ?? ''
  result.filters = Object.entries(filters)
    .filter(([key, _]) => route.query[key])
    .reduce((prev, [key, filter]): { [K: string]: any } => {
      if (filter.type === FilterType.Text) {
        return {
          ...prev,
          [key]: route.query[key] as string,
        }
      } else if (filter.type === FilterType.Range) {
        const [start, end] = (route.query[key] as string)?.split('-') ?? [
          null,
          null,
        ]
        return {
          ...prev,
          [key]: [start !== '*' ? start : null, end !== '*' ? end : null],
        }
      }
      return prev
    }, {})
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
