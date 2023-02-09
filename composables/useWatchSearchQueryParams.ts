import { useRoute, watch } from '@nuxtjs/composition-api'

export const useWatchSearchQueryParams = (
  cb: () => void,
  ignoreParams = ['page', 'itemsPerPage', 'sortDesc', 'sortBy']
) => {
  const route = useRoute()
  watch(
    () => route.value.query,
    (newVal, oldVal) => {
      for (const param of ignoreParams) {
        if (newVal[param] !== oldVal[param]) return
      }
      cb()
    }
  )
}
