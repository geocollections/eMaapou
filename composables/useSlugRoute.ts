import {
  ComputedRef,
  reactive,
  Ref,
  toRef,
  useRoute,
  useRouter,
  watch,
  wrapProperty,
} from '@nuxtjs/composition-api'
import { Location } from 'vue-router'
import { useI18n } from './useI18n'
import { Tab } from '~/constants'
const useValidateTabRoute = wrapProperty('$validateTabRoute', false)
const useCreateSlugRoute = wrapProperty('$createSlugRoute', false)
export function useSlugRoute({
  slug,
  tabs,
  watchableObject,
  pending,
  validRoute,
}: {
  slug: ComputedRef<string>
  tabs: Ref<Tab[]>
  watchableObject: Ref<any>
  pending: Ref<any>
  validRoute: Ref<any>
}) {
  const createSlugRoute = useCreateSlugRoute()
  const validateTabRoute = useValidateTabRoute()
  const route = useRoute()
  const router = useRouter()
  const i18n = useI18n()
  const state = reactive({
    validRoute: {} as Location,
  })
  watch([watchableObject, pending], ([_object, pending]) => {
    if (pending) return
    validRoute.value = setSlugRoute({
      slug: slug.value,
      tabs: tabs.value,
    })
  })
  const setSlugRoute = ({ slug, tabs }: { slug: string; tabs: Tab[] }) => {
    const slugRoute = createSlugRoute(route.value, slug)
    const validRoute = i18n.localeLocation(validateTabRoute(slugRoute, tabs))

    if (router.resolve(validRoute as Location).href !== route.value.path)
      router.replace(validRoute as Location)
    return validRoute as Location
  }
  return toRef(state, 'validRoute')
}
