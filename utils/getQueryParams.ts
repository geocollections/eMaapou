import isFilterValid from './isFilterValid'
import { IOptions } from '~/services'
import { FilterType } from '~/types/enums'
import { Filter } from '~/types/filters'

export default ({
  q,
  qKey,
  filters,
  globalFilters,
  tableOptions,
}: {
  q: string
  qKey: string
  filters?: { [K: string]: Filter }
  globalFilters?: { [K: string]: Filter }
  tableOptions: IOptions
}) => {
  const query: { [K: string]: any | any[] } = {}

  if (q.length > 0) {
    query[qKey] = q
  }
  query.page = tableOptions.page.toString()
  query.itemsPerPage = tableOptions.itemsPerPage.toString()
  query.sortBy = tableOptions.sortBy
  query.sortDesc = tableOptions.sortDesc

  if (filters) {
    Object.entries(filters)
      .filter(([_, filter]) => isFilterValid(filter))
      .forEach(([key, filter]) => {
        if (filter.type === FilterType.Text) query[key] = filter.value
        else if (filter.type === FilterType.Range) {
          const start = filter.value[0] ?? '*'
          const end = filter.value[1] ?? '*'
          query[key] = `${start}-${end}`
        }
      })
  }
  if (globalFilters) {
    Object.entries(globalFilters)
      .filter(([_, filter]) => isFilterValid(filter))
      .forEach(([key, filter]) => {
        if (filter.type === FilterType.Text) query[key] = filter.value
        else if (filter.type === FilterType.Range) {
          const start = filter.value[0] ?? '*'
          const end = filter.value[1] ?? '*'
          query[key] = `${start}-${end}`
        } else if (filter.type === FilterType.Geom) {
          query[key] = JSON.stringify(filter.value)
        }
      })
  }
  return query
}
