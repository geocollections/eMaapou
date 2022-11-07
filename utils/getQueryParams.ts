import isFilterValid from './isFilterValid'
import { IOptions } from '~/services'
import { FilterType } from '~/types/enums'
import { Filter } from '~/types/filters'

export default ({
  q,
  filters,
  globalFilters,
  tableOptions,
}: {
  q?: { key: string; value: string }
  filters?: { [K: string]: Filter }
  globalFilters?: { [K: string]: Filter }
  tableOptions: IOptions
}) => {
  const query: { [K: string]: any | any[] } = {}

  if (q && q.value.length > 0) {
    query[q.key] = q.value
  }
  query.page = tableOptions.page?.toString()
  query.itemsPerPage = tableOptions.itemsPerPage?.toString()
  query.sortBy = tableOptions.sortBy?.join(',')
  query.sortDesc = tableOptions.sortDesc?.join(',')

  if (filters) {
    Object.entries(filters)
      .filter(([_, filter]) => isFilterValid(filter))
      .forEach(([key, filter]) => {
        query[key] = serializeFilter(filter)
      })
  }
  if (globalFilters) {
    Object.entries(globalFilters)
      .filter(([_, filter]) => isFilterValid(filter))
      .forEach(([key, filter]) => {
        query[key] = serializeFilter(filter)
      })
  }
  return query
}

const serializeFilter = (filter: Filter) => {
  if (filter.type === FilterType.Text) return filter.value
  else if (filter.type === FilterType.Range) {
    const start = filter.value[0] ?? '*'
    const end = filter.value[1] ?? '*'
    return `${start}-${end}`
  } else if (filter.type === FilterType.Geom) {
    return JSON.stringify(filter.value)
  } else if (filter.type === FilterType.Object) {
    return JSON.stringify(filter.value)
  } else if (filter.type === FilterType.ListOr) {
    return filter.value
  } else if (filter.type === FilterType.RangeAlt) {
    return filter.value
  } else if (filter.type === FilterType.Boolean) {
    return `${filter.value}`
  } else if (filter.type === FilterType.List) {
    return filter.value.map((value) => JSON.stringify(value))
  }
}
