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
            <button-tabs ref="tabs" :tabs="computedTabs" />
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

<script>
import { mdiMagnify } from '@mdi/js'
import orderBy from 'lodash/orderBy'
import ButtonTabs from '~/components/ButtonTabs.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import { TABS_QUICK_SEARCH } from '~/constants'
export default {
  name: 'QuickSearch',
  components: { ButtonTabs, BaseHeader },
  async asyncData({ route, $hydrateTab, from, $getMaxTab, redirect }) {
    const tabs = TABS_QUICK_SEARCH.allIds.map(
      (id) => TABS_QUICK_SEARCH.byIds[id]
    )

    const hydratedTabs = await Promise.all(
      tabs.map(
        async (tab) =>
          await $hydrateTab(tab, {
            countParams: {
              solr: {
                default: {
                  q: route.query?.q ?? '*',
                },
                photo: {
                  q: route.query?.q ?? '*',
                  fq: 'specimen_image_attachment:2',
                },
              },
            },
          })
      )
    )
    if (from !== undefined && !from?.name.startsWith('search')) {
      const validRoute = $getMaxTab(route, hydratedTabs)
      if (validRoute.path !== route.path) redirect(validRoute)
    }
    return {
      tabs: hydratedTabs,
    }
  },
  data() {
    return {
      tabs: TABS_QUICK_SEARCH.allIds.map((id) => TABS_QUICK_SEARCH.byIds[id]),
    }
  },
  head() {
    return {
      title: this.$t('search.pageTitle'),
    }
  },
  computed: {
    computedTabs() {
      return orderBy(this.tabs, ['count'], ['desc'])
    },
    icons() {
      return {
        mdiMagnify,
      }
    },
  },
  watch: {
    '$route.query'(newVal, oldVal) {
      if (newVal.q === oldVal.q) return
      this.handleSearch()
    },
  },
  methods: {
    handleSearch: async function () {
      this.tabs = await Promise.all(
        this.tabs.map(
          async (tab) =>
            await this.$hydrateTab(tab, {
              countParams: {
                solr: {
                  default: {
                    q: this.$route.query?.q ?? '*',
                  },
                  photo: {
                    q: this.$route.query?.q ?? '*',
                    fq: 'specimen_image_attachment:2',
                  },
                },
              },
            })
        )
      )
    },
  },
}
</script>
