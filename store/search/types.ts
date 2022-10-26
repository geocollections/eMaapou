import { IOptions } from '~/services'
import { Filter } from '~/types/filters'
export type SearchModuleState = {
  items: any[]
  count: number
  useMap: boolean
  useInstitutions: boolean
  options: IOptions
  query: string
  filters: {
    byIds: { [key: string]: Filter }
    allIds: string[]
  }
}
