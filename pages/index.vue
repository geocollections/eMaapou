<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
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
          routeName: 'index',
          title: 'landing.drillcores',
          count: 1,
          props: {},
          // HACK: right now there is no way to get the tab queryFields, so they are copied here.
          // Probably should move queryFields and other data into stores.
          queryFields: {
            drillcore: app.i18n.locale === 'et' ? 'drillcore' : 'drillcore_en',
            depth: 'depth',
            boxes: 'boxes',
            box_numbers: 'box_numbers',
            storage__location: 'storage__location',
            year: 'year',
            remarks: 'remarks',
          },
        },
        {
          id: 'locality',
          routeName: 'index-localities',
          title: 'landing.localities',
          count: 1,
          props: {},
          queryFields: {
            locality: app.i18n.locale === 'et' ? 'locality' : 'locality_en',
            country:
              app.i18n.locale === 'et' ? 'country__value' : 'country__value_en',
          },
        },
        {
          id: 'site',
          routeName: 'index-sites',
          title: 'landing.sites',
          count: 1,
          props: {},
          queryFields: {
            id: 'id',
            name: 'name',
            project:
              app.i18n.locale === 'et' ? 'project__name' : 'project__name_en',
          },
        },
      ]

      const forLoop = async () => {
        const filteredTabs = tabs.filter((item) => !!item.id)
        for (const item of filteredTabs) {
          let countResponse
          if (item?.isSolr)
            countResponse = await app.$services.sarvSolr.getResourceCount(
              item.id,
              {}
            )
          else
            countResponse = await app.$services.sarvREST.getResourceCount(
              item.id,
              {}
            )
          item.count = countResponse?.count ?? 0
        }
      }
      await forLoop()

      return { tabs, initActiveTab: route.path }
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
          let countResponse
          if (item?.isSolr)
            countResponse = await this.$services.sarvSolr.getResourceCount(
              item.id,
              {}
            )
          else
            countResponse = await this.$services.sarvREST.getResourceCount(
              item.id,
              !isEmpty(this.search) || this.search !== null
                ? {
                    multi_search: `value:${this.search};fields:${Object.values(
                      item.queryFields
                    )
                      .map((field) => field)
                      .join()};lookuptype:icontains`,
                  }
                : {}
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
