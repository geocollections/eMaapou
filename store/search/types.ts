import { IOptions } from '~/services'
import { Filter } from '~/types/filters'
export type SearchModuleState<Filters extends { [K: string]: Filter }> = {
  name: string
  items: any[]
  count: number
  useMap: boolean
  useInstitutions: boolean
  options: IOptions
  query: string
  filters: Filters
}
