<template>
  <detail>
    <template #title>
      <prev-next-nav-title :ids="ids" :title="preparation.preparation_number" />
    </template>

    <template #column-left>
      <v-card-title class="pl-md-0 pr-md-4 px-0">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text class="pl-md-0 pr-md-4 px-0">
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <data-row
                :title="$t('preparation.preparation_number')"
                :value="preparation.preparation_number"
              />
              <link-data-row
                :title="$t('preparation.sample')"
                :value="
                  preparation.sample__number ||
                  preparation.sample__number_additional ||
                  preparation.sample__number_field ||
                  preparation.sample_id
                "
                nuxt
                :href="
                  localePath({
                    name: 'sample-id',
                    params: { id: preparation.sample_id },
                  })
                "
              />
              <data-row
                :title="$t('preparation.sample_number')"
                :value="preparation.sample_number"
              />
              <link-data-row
                :title="$t('preparation.analysis')"
                :value="preparation.analysis_id"
                nuxt
                :href="
                  localePath({
                    name: 'analysis-id',
                    params: { id: preparation.analysis_id },
                  })
                "
              />
              <link-data-row
                :title="$t('preparation.taxon')"
                :value="preparation.taxon__taxon"
                @link-click="
                  $openWindow(`https://fossiilid.info/${preparation.taxon}`)
                "
              />
              <data-row
                :title="$t('preparation.agent')"
                :value="preparation.agent__agent || preparation.agent_txt"
              />
              <data-row
                :title="$t('preparation.identification_agent')"
                :value="preparation.identification_agent__agent"
              />
              <data-row
                :title="$t('preparation.date_prepared')"
                :value="
                  preparation.date_prepared || preparation.date_prepared_txt
                "
              />
              <data-row
                :title="$t('preparation.identification_date')"
                :value="preparation.identification_date"
              />
              <data-row
                :title="$t('preparation.identification_remarks')"
                :value="preparation.identification_remarks"
              />
              <data-row
                :title="$t('preparation.location')"
                :value="preparation.location"
              />
              <data-row
                :title="$t('preparation.storage')"
                :value="preparation.storage__location"
              />
              <data-row
                :title="$t('preparation.owner')"
                :value="preparation.owner__agent"
              />
              <data-row
                v-if="preparation.date_added"
                :title="$t('preparation.dateAdded')"
                :value="
                  new Date(preparation.date_added).toISOString().split('T')[0]
                "
              />
              <data-row
                v-if="preparation.date_changed"
                :title="$t('preparation.dateChanged')"
                :value="
                  new Date(preparation.date_changed).toISOString().split('T')[0]
                "
              />
              <data-row
                :title="$t('preparation.remarks')"
                :value="preparation.remarks"
              />
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>
    <template #bottom>
      <v-card v-if="filteredTabs.length > 0" class="mt-2 pb-2">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import { isNil } from 'lodash'
import Tabs from '~/components/Tabs.vue'
import PrevNextNavTitle from '~/components/PrevNextNavTitle'
import DataRow from '~/components/DataRow'
import LinkDataRow from '~/components/LinkDataRow'
import Detail from '~/components/templates/Detail.vue'

export default {
  components: { LinkDataRow, DataRow, PrevNextNavTitle, Tabs, Detail },
  async asyncData({ params, route, error, app, redirect }) {
    try {
      const detailViewResponse = await app.$services.sarvREST.getResource(
        'preparation',
        params.id
      )
      const ids = detailViewResponse?.ids
      const preparation = detailViewResponse.results[0]

      const tabs = [
        {
          id: 'attachment_link',
          routeName: 'preparation-id',
          title: 'preparation.attachments',
          count: 0,
          props: {},
        },
        {
          id: 'taxon_list',
          isSolr: false,
          routeName: 'preparation-id-taxa',
          title: 'preparation.taxa',
          count: 0,
          props: {},
        },
      ]

      const hydratedTabs = (
        await Promise.all(
          tabs.map(
            async (tab) =>
              await app.$hydrateCount(tab, {
                solr: { default: { fq: `preparation_id:${preparation.id}` } },
                api: { default: { preparation: preparation.id } },
              })
          )
        )
      ).map((tab) =>
        app.$populateProps(tab, {
          ...tab.props,
          preparation: preparation.id,
        })
      )

      const validPath = app.$validateTabRoute(route, hydratedTabs)
      if (validPath !== route.path) redirect(validPath)

      return {
        preparation,
        ids,
        initActiveTab: validPath,
        tabs: hydratedTabs,
      }
    } catch (err) {
      error({
        message: `Could not find preparation ${route.params.id}`,
        path: route.path,
      })
    }
  },
  head() {
    return {
      title: this.preparation.preparation_number,
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
  },
  methods: {
    isNil,
  },
}
</script>
