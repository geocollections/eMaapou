<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col>
        <h1 class="text-center">{{ $t('title') }}</h1>
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
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col>
        <v-card>
          <tabs ref="tabs" :tabs="tabs" :init-active-tab="initActiveTab" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { debounce, isEmpty } from 'lodash'
import Tabs from '@/components/Tabs'
import { mapActions } from 'vuex'

export default {
  components: { Tabs },
  async asyncData({ params, route, error, app }) {
    try {
      const tabs = [
        {
          id: 'drillcore',
          routeName: 'search',
          title: 'landing.drillcores',
          isSolr: true,
          count: 0,
          props: {},
        },
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
          id: 'sample',
          routeName: 'search-samples',
          title: 'landing.samples',
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
  data() {
    return {
      search: '',
    }
  },
  head() {
    return {
      title: this.$t('title'),
    }
  },
  methods: {
    ...mapActions('landing', ['updateSearch']),
    handleSearch: debounce(async function () {
      const forLoop = async () => {
        const filteredTabs = this.tabs.filter((item) => !!item.id)
        for (const item of filteredTabs) {
          const countResponse = await this.$services.sarvSolr.getResourceCount(
            item.id,
            { q: isEmpty(this.search) ? '*' : `${this.search}` }
          )

          item.count = countResponse?.count ?? 0
        }
      }
      await forLoop()

      this.$refs.tabs.$refs.tabs.callSlider()
      this.updateSearch(this.search)
    }, 500),
  },
}
</script>
