import {
  ComputedRef,
  reactive,
  Ref,
  toRef,
  // useContext,
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
}: {
  slug: ComputedRef<string>
  tabs: Tab[]
  watchableObject: Ref<any>
}) {
  const createSlugRoute = useCreateSlugRoute()
  const validateTabRoute = useValidateTabRoute()
  // const ctx = useContext()
  const route = useRoute()
  const router = useRouter()
  const i18n = useI18n()
  const state = reactive({
    validRoute: {} as Location,
  })
  watch(
    () => watchableObject,
    () => {
      state.validRoute = setSlugRoute({
        slug: slug.value,
        tabs,
      })
    },
    { deep: true }
  )
  const setSlugRoute = ({ slug, tabs }: { slug: string; tabs: Tab[] }) => {
    const slugRoute = createSlugRoute(route.value, slug)
    const validRoute = i18n.localeLocation(validateTabRoute(slugRoute, tabs))

    if (router.resolve(validRoute as Location).href !== route.value.path)
      // ctx.redirect(validRoute as Location)
      router.replace(validRoute as Location)
    return validRoute as Location
  }

  return toRef(state, 'validRoute')
}
