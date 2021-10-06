import { cloneDeep } from 'lodash'
import { HEADERS_ANALYTICAL_DATA } from '~/constants'

export const initState = () => {
  return {
    ...cloneDeep(HEADERS_ANALYTICAL_DATA),
  }
}

export default initState
