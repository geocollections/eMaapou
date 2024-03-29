import { computed, useContext } from '@nuxtjs/composition-api'
import { accessorType } from '~/store'
export const useFilter = <
  T extends keyof typeof accessorType['search'],
  U extends keyof typeof accessorType['search'][T]['filters']
>(
  module: T,
  filterKey: U,
  postSet?: () => void
) => {
  const { $accessor } = useContext()
  return computed({
    get: () => $accessor.search[module].filters[filterKey].value,
    set: (value) => {
      $accessor.search[module].setFilterValue({
        key: filterKey,
        value,
      })
      if (postSet) postSet()
    },
  })
}
