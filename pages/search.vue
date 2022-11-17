<template>
  <div>
    <v-row no-gutters justify="center" align="center">
      <v-col class="pt-5">
        <base-header :icon="icons.mdiMagnify">
          <template #title>
            <i18n path="quickSearch.title" tag="div">
              <template #query>
                <b v-text="$route.query.q" />
              </template>
            </i18n>
          </template>
        </base-header>
      </v-col>
    </v-row>
    <v-row class="px-sm-3" no-gutters>
      <v-col class="pt-2 pt-md-0">
        <v-card flat color="transparent">
          <v-card-actions class="pt-0">
            <button-tabs :tabs="tabs" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters class="px-sm-3" justify="center">
      <v-col>
        <v-card>
          <nuxt-child :query="$route.query.q" keep-alive />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import isNil from 'lodash/isNil'
import { mdiMagnify } from '@mdi/js'
import orderBy from 'lodash/orderBy'
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  useContext,
  useFetch,
  useRoute,
  useRouter,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  watch,
} from '@nuxtjs/composition-api'
import { Location } from 'vue-router'
import ButtonTabs from '~/components/ButtonTabs.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { Tab, TABS_QUICK_SEARCH } from '~/constants'
import { useI18n } from '~/composables/useI18n'

export default defineComponent({
  name: 'QuickSearch',
  components: { ButtonTabs, BaseHeader },
  setup() {
    const { $hydrateTab, from, $getMaxTab } = useContext()
    const i18n = useI18n()
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      tabs: [] as Tab[],
    })
    const firstEnter = ref(true)
    const { fetch } = useFetch(async () => {
      const tabs = TABS_QUICK_SEARCH.allIds.map(
        (id) => TABS_QUICK_SEARCH.byIds[id]
      )

      const hydratedTabs = await Promise.all(
        tabs.map((tab) =>
          $hydrateTab(tab, {
            countParams: {
              solr: {
                default: {
                  q: route.value.query?.q ?? '*',
                },
                photo: {
                  q: route.value.query?.q ?? '*',
                  fq: 'specimen_image_attachment:2',
                },
              },
            },
          })
        )
      )
      state.tabs = orderBy(hydratedTabs, ['count'], ['desc'])
      // If navigating to quick search from elsewhere in the app, go to the route with the most results
      if (!isNil(from.value) && firstEnter.value) {
        firstEnter.value = false
        const location = {
          name: route.value.name ?? undefined,
          query: route.value.query,
        }
        const validRoute = i18n.localeLocation($getMaxTab(location, state.tabs))

        if (
          router.resolve(validRoute as Location).route.path !== route.value.path
        )
          router.replace(validRoute as Location)
      }
    })
    watch(
      () => route.value.query.q,
      () => {
        fetch()
      }
    )
    return {
      ...toRefs(state),
    }
  },
  head() {
    return {
      title: this.$t('search.pageTitle') as string,
    }
  },
  computed: {
    icons() {
      return {
        mdiMagnify,
      }
    },
  },
})
</script>
