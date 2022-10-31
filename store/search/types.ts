import { IOptions } from '~/services'
import { Filter } from '~/types/filters'
export type SearchModuleState = {
  name: string
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
