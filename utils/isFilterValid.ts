import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
import { FilterType } from '~/types/enums'
import { Filter } from '~/types/filters'

export default (filter: Filter): boolean => {
  if (filter.type === FilterType.Range)
    return !(isNil(filter.value[0]) && isNil(filter.value[1]))
  if (filter.type === FilterType.Text) return filter.value?.trim().length > 0
  if (filter.type === FilterType.RangeAlt) return filter.value.length > 0

  if (filter.type === FilterType.Object)
    return (
      // @ts-ignore
      filter.value !== null && Object.hasOwn(filter.value, filter.searchField)
    )
  if (filter.type === FilterType.List || filter.type === FilterType.ListOr)
    return !isEmpty(filter.value)
  if (filter.type === FilterType.Boolean) return filter.value
  return filter.value !== null
}
