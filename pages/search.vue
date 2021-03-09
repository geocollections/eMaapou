<template>
  <v-container fluid class="pa-0">
    <v-row justify="center" align="center">
      <v-col>
        <h1 class="text-center">
          {{ $t('landing.searchTitle') }}
        </h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col sm="7" md="5">
        <v-text-field
          v-model="search"
          dense
          outlined
          color="deep-orange darken-2"
          append-icon="mdi-magnify"
          :label="$t('common.search')"
          hide-details
          clearable
          @input="handleSearch"
        />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col>
        <button-tabs ref="tabs" :tabs="tabs" :init-active-tab="initActiveTab" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { debounce, isEmpty, orderBy } from 'lodash'
import ButtonTabs from '@/components/ButtonTabs'
import { mapFields } from 'vuex-map-fields'
export default {
  components: { ButtonTabs },
  // layout: 'search',
  async asyncData({ params, route, error, app }) {
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
          title: 'landing.preparations',
          isSolr: true,
          count: 0,
          props: {},
        },
      ]
      return {
        initActiveTab: route.path,
        tabs: await Promise.all(
          tabs.map(async (tab) => await app.$populateCount(tab))
        ),
      }
    } catch (err) {}
  },
  head() {
    return {
      title: this.$t('search.pageTitle'),
    }
  },
  computed: {
    ...mapFields('landing', ['search']),
  },
  methods: {
    handleSearch: debounce(async function () {
      this.tabs = orderBy(
        await Promise.all(
          this.tabs.map(
            async (tab) =>
              await this.$populateCount(tab, {
                solr: {
                  default: { q: isEmpty(this.search) ? '*' : `${this.search}` },
                },
              })
          )
        ),
        ['count'],
        ['desc']
      )
    }, 500),
  },
}
</script>
