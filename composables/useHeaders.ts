import { computed, reactive, Ref, useContext } from '@nuxtjs/composition-api'
import cloneDeep from 'lodash/cloneDeep'
import { Headers, Header } from '~/constants'
import { IOptions } from '~/services'
import { HeadersState } from '~/store/headers/state'

export const useHeaders = ({
  localHeaders,
  options,
}: {
  localHeaders: Headers
  options: Ref<IOptions>
}) => {
  const { i18n } = useContext()
  const state = reactive({
    localHeaders: cloneDeep(localHeaders),
  })

  const translateHeader = (header: Header) => {
    if (header.translate === undefined || header.translate) {
      header.text = i18n.t(header.text).toString()
    }
    return header
  }

  const headers = computed(() => {
    return state.localHeaders.allIds.map((id: string) =>
      translateHeader(state.localHeaders.byIds[id])
    )
  })

  const handleHeadersChange = (e: string) => {
    state.localHeaders.byIds[e].show = !state.localHeaders.byIds[e].show
  }
  const handleHeadersReset = () => {
    state.localHeaders = cloneDeep(localHeaders)
    options.value.sortBy?.forEach((headerId: string) => {
      state.localHeaders.byIds[headerId].show = true
    })
  }

  return { headers, handleHeadersChange, handleHeadersReset }
}

export const useHeadersWithState = ({
  module,
  localHeaders,
  statefulHeaders,
  options,
}: {
  module: keyof HeadersState
  localHeaders: Headers
  statefulHeaders: boolean
  options: Ref<IOptions>
}) => {
  const { i18n, $accessor } = useContext()
  const state = reactive({
    localHeaders: cloneDeep(localHeaders),
  })

  const translateHeaderFromState = (header: Header) => {
    return {
      ...header,
      text:
        header.translate === undefined || header.translate
          ? i18n.t(header.text).toString()
          : header.text,
    }
  }
  const translateHeader = (header: Header) => {
    if (header.translate === undefined || header.translate) {
      header.text = i18n.t(header.text).toString()
    }
    return header
  }

  const headers = computed(() => {
    if (statefulHeaders)
      return $accessor.headers[module].allIds.map((id: string) =>
        translateHeaderFromState($accessor.headers[module].byIds[id])
      )
    return state.localHeaders.allIds.map((id: string) =>
      translateHeader(state.localHeaders.byIds[id])
    )
  })

  const handleHeadersChange = (e: string) => {
    if (statefulHeaders) $accessor.headers.toggleHeader({ module, headerId: e })
    else state.localHeaders.byIds[e].show = !state.localHeaders.byIds[e].show
  }
  const handleHeadersReset = () => {
    if (statefulHeaders)
      $accessor.headers.resetHeaders({
        module,
        options: options.value,
      })
    else {
      state.localHeaders = cloneDeep(localHeaders)
      options.value.sortBy?.forEach((headerId: string) => {
        state.localHeaders.byIds[headerId].show = true
      })
    }
  }

  return { headers, handleHeadersChange, handleHeadersReset }
}
