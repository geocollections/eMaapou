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
          <v-card-title class="montserrat pl-2 py-1">
            {{ $t('common.showSearch') }}
          </v-card-title>
          <global-search @input="handleSearch" />
        </v-card>
      </v-col>
      <v-col>
        <v-card flat color="transparent">
          <v-card-title class="montserrat pl-2 py-1">
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
          <nuxt-child :query="searchQuery" keep-alive />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { debounce, isEmpty, isEqual, orderBy } from 'lodash'
import { mapFields } from 'vuex-map-fields'
import ButtonTabs from '~/components/ButtonTabs.vue'
import GlobalSearch from '~/components/search/GlobalSearch.vue'
import TitleCard from '~/components/TitleCard.vue'
export default {
  name: 'QuickSearch',
  components: { ButtonTabs, GlobalSearch, TitleCard },
  // layout: 'search',
  async asyncData({ params, route, error, app, store, redirect }) {
    try {
      const tabs = [
        {
          id: 'locality',
          routeName: 'search-localities',
          title: 'landing.localities',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'site',
          routeName: 'search-sites',
          title: 'landing.sites',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'drillcore',
          routeName: 'search',
          title: 'landing.drillcores',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'sample',
          routeName: 'search-samples',
          title: 'landing.samples',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'analysis',
          routeName: 'search-analyses',
          title: 'landing.analyses',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'preparation',
          routeName: 'search-preparations',
          path: '/localities',
          title: 'landing.preparations',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'reference',
          routeName: 'search-references',
          title: 'landing.references',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'specimen',
          routeName: 'search-specimens',
          title: 'landing.specimens',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'doi',
          routeName: 'search-dois',
          title: 'landing.dois',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'dataset',
          routeName: 'search-datasets',
          title: 'landing.datasets',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'attachment',
          routeName: 'search-files',
          title: 'landing.attachments',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'photo',
          table: 'attachment',
          routeName: 'search-photos',
          title: 'landing.photos',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'taxon',
          routeName: 'search-taxa',
          title: 'landing.taxa',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'rock',
          routeName: 'search-rocks',
          title: 'landing.rocks',
          isSolr: true,
          count: 0,
          props: {},
        },
        {
          id: 'stratigraphy',
          routeName: 'search-stratigraphy',
          title: 'landing.stratigraphy',
          isSolr: true,
          count: 0,
          props: {},
        },
      ]

      const hydratedTabs = await Promise.all(
        tabs.map(
          async (tab) =>
            await app.$hydrateCount(tab, {
              solr: {
                default: {
                  q: isEmpty(store.state.search.searchQuery)
                    ? '*'
                    : `${store.state.search.searchQuery}`,
                },
                photo: {
                  q: isEmpty(store.state.search.searchQuery)
                    ? '*'
                    : `${store.state.search.searchQuery}`,
                  fq: 'specimen_image_attachment:2',
                },
              },
            })
        )
      )
      const validPath = app.$validateTabRoute(route, hydratedTabs, {
        findMax: true,
      })
      if (validPath !== route.path) redirect(validPath)
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
    ...mapFields('search', ['searchQuery']),
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
            await this.$hydrateCount(tab, {
              solr: {
                default: {
                  q: isEmpty(this.searchQuery) ? '*' : `${this.searchQuery}`,
                },
                photo: {
                  q: isEmpty(this.searchQuery) ? '*' : `${this.searchQuery}`,
                  fq: 'specimen_image_attachment:2',
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
