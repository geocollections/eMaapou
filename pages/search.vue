<template>
  <div>
    <v-row no-gutters justify="center" align="center">
      <v-col>
        <title-card :title="$t('landing.searchTitle')" class="title-heading" />
      </v-col>
    </v-row>
    <v-row class="px-sm-3" no-gutters>
      <v-col cols="12" md="4" lg="3" class="pr-md-3">
        <v-card flat color="transparent">
          <v-card-title class="py-1 pl-2 montserrat">
            {{ $t('common.showSearch') }}
          </v-card-title>
          <query-search-field v-model="query" @input="handleSearch" />
        </v-card>
      </v-col>
      <v-col class="pt-2 pt-md-0">
        <v-card flat color="transparent">
          <v-card-title class="py-1 pl-2 montserrat">
            {{ $t('common.selectModule') }}
          </v-card-title>
          <v-card-actions class="pt-0">
            <button-tabs ref="tabs" :tabs="computedTabs" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters class="px-sm-3" justify="center">
      <v-col>
        <!-- <div class="mb-2">
          <button-tabs ref="tabs" :tabs="computedTabs" />
        </div> -->

        <v-card>
          <nuxt-child :query="query" keep-alive />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { debounce, isEmpty, isEqual, orderBy } from 'lodash'
import { mapFields } from 'vuex-map-fields'
import ButtonTabs from '~/components/ButtonTabs.vue'
import TitleCard from '~/components/TitleCard.vue'
import { TABS_QUICK_SEARCH } from '~/constants'
import QuerySearchField from '~/components/fields/QuerySearchField.vue'
export default {
  name: 'QuickSearch',
  components: { ButtonTabs, TitleCard, QuerySearchField },
  // layout: 'search',
  async asyncData({ route, store, redirect, $hydrateTab, $getMaxTab, from }) {
    try {
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
                    q: isEmpty(store.state.search.query)
                      ? '*'
                      : `${store.state.search.query}`,
                  },
                  photo: {
                    q: isEmpty(store.state.search.query)
                      ? '*'
                      : `${store.state.search.query}`,
                    fq: 'specimen_image_attachment:2',
                  },
                },
              },
            })
        )
      )

      if (from) {
        const validPath = $getMaxTab(route, hydratedTabs)
        if (validPath !== route.path) redirect(validPath)
      }

      return {
        tabs: hydratedTabs,
      }
    } catch (err) {}
  },
  head() {
    return {
      title: this.$t('search.pageTitle'),
    }
  },
  computed: {
    ...mapFields('search', { query: 'query' }),
    computedTabs() {
      // Filtering out empty tabs but still showing active tab whether it is empty or not
      // const filteredTabs = this.tabs.filter((item) =>
      //   this.$route.name.includes(
      //     item.id === 'drillcore' ? `${item.routeName}__` : item.routeName
      //   )
      // )
      return orderBy(this.tabs, ['count'], ['desc'])
    },
  },
  watch: {
    '$route.query'(newVal, oldVal) {
      if (!isEqual(newVal, oldVal)) {
        this.handleSearch()
      }
    },
  },
  created() {
    if (this.$route.query) {
      // Todo: Should deconstruct query params (page?, paginate? sort?)
      if (!isEmpty(this.$route.query?.q)) this.search = this.$route.query.q
      this.handleSearch()
    }
  },
  methods: {
    handleSearch: debounce(async function () {
      this.tabs = await Promise.all(
        this.tabs.map(
          async (tab) =>
            await this.$hydrateTab(tab, {
              countParams: {
                solr: {
                  default: {
                    q: isEmpty(this.query) ? '*' : `${this.query}`,
                  },
                  photo: {
                    q: isEmpty(this.query) ? '*' : `${this.query}`,
                    fq: 'specimen_image_attachment:2',
                  },
                },
              },
            })
        )
      )
      this.updateRouteQuery()
    }, 500),
    updateRouteQuery() {
      const routeName = this.$route.name.includes('search')
        ? this.$route.name.split('__')[0]
        : 'search'
      const query = isEmpty(this.search) ? {} : { q: this.search }
      this.$router.push(this.localePath({ name: routeName, query }))
    },
  },
}
</script>
