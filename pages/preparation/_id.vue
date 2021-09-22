<template>
  <detail>
    <template #title>
      <title-card-detail
        :ids="ids"
        :title="preparation.preparation_number"
        class="title-main"
      />
    </template>

    <template #column-left>
      <v-card-title class="subsection-title">{{
        $t('common.general')
      }}</v-card-title>
      <v-card-text>
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <data-row
                :title="$t('preparation.preparation_number')"
                :value="preparation.preparation_number"
              />
              <link-data-row
                v-if="sample"
                :title="$t('preparation.sample')"
                :value="
                  sample.number ||
                  sample.number_additional ||
                  sample.number_field ||
                  sample.id
                "
                nuxt
                :href="
                  localePath({
                    name: 'sample-id',
                    params: { id: sample.id },
                  })
                "
              />
              <data-row
                :title="$t('preparation.sample_number')"
                :value="preparation.sample_number"
              />
              <link-data-row
                v-if="analysis"
                :title="$t('preparation.analysis')"
                :value="analysis.id"
                nuxt
                :href="
                  localePath({
                    name: 'analysis-id',
                    params: { id: analysis.id },
                  })
                "
              />
              <link-data-row
                v-if="taxon"
                :title="$t('preparation.taxon')"
                :value="taxon.taxon"
                @link-click="
                  $openWindow(`https://fossiilid.info/${preparation.taxon.id}`)
                "
              />
              <data-row
                v-if="agent"
                :title="$t('preparation.agent')"
                :value="agent.agent || preparation.agent_txt"
              />
              <data-row
                v-if="identification_agent"
                :title="$t('preparation.identification_agent')"
                :value="identification_agent.agent"
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
                v-if="storage"
                :title="$t('preparation.storage')"
                :value="storage.location"
              />
              <data-row
                v-if="owner"
                :title="$t('preparation.owner')"
                :value="owner.agent"
              />
              <data-row
                v-if="preparation.date_added"
                :title="$t('preparation.dateAdded')"
                :value="$formatDate(preparation.date_added)"
              />
              <data-row
                v-if="preparation.date_changed"
                :title="$t('preparation.dateChanged')"
                :value="$formatDate(preparation.date_changed)"
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
      <v-card v-if="filteredTabs.length > 0" class="mt-4 pb-4">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import { isNil } from 'lodash'
import TitleCardDetail from '@/components/TitleCardDetail'
import Tabs from '~/components/Tabs.vue'
import DataRow from '~/components/DataRow'
import LinkDataRow from '~/components/LinkDataRow'
import Detail from '~/components/templates/Detail.vue'
import { TABS_PREPARATION } from '~/constants'

export default {
  components: { LinkDataRow, DataRow, TitleCardDetail, Tabs, Detail },

  async asyncData({
    params,
    route,
    error,
    redirect,
    $validateTabRoute,
    $services,
    $hydrateTab,
    $createSlugRoute,
  }) {
    try {
      const detailViewResponse = await $services.sarvREST.getResource(
        'preparation',
        params.id,
        {
          params: {
            nest: 1,
          },
        }
      )
      const ids = detailViewResponse?.ids
      const preparation = detailViewResponse

      const tabs = TABS_PREPARATION.allIds.map(
        (id) => TABS_PREPARATION.byIds[id]
      )

      const hydratedTabs = await Promise.all(
        tabs.map(
          async (tab) =>
            await $hydrateTab(tab, {
              countParams: {
                solr: { default: { fq: `preparation_id:${preparation.id}` } },
                api: { default: { preparation: preparation.id } },
              },
            })
        )
      )

      const slugRoute = $createSlugRoute(route, preparation.preparation_number)

      const validPath = $validateTabRoute(slugRoute, hydratedTabs)
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
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.preparation.preparation_number,
        },
      ],
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
    sample() {
      return this.preparation?.sample
    },
    analysis() {
      return this.preparation?.analysis
    },
    taxon() {
      return this.preparation?.taxon
    },
    agent() {
      return this.preparation?.agent
    },
    identification_agent() {
      return this.preparation?.identification_agent
    },
    storage() {
      return this.preparation?.storage
    },
    owner() {
      return this.preparation?.owner
    },
  },
  methods: {
    isNil,
  },
}
</script>
