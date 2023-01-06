import { IOptions } from '~/services'
import { Filter } from '~/types/filters'
export type SearchModuleState<Filters extends string | number | symbol> = {
  name: string
  items: any[]
  count: number
  useMap: boolean
  useInstitutions: boolean
  options: IOptions
  query: string
  filters: {
    byIds: { [K in Filters]: Filter }
    allIds: string[] // TODO: Remove
  }
}
