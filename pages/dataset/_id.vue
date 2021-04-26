<template>
  <detail>
    <template #title>
      <prev-next-nav-title
        :ids="ids"
        :title="$translate({ et: dataset.name, en: dataset.name_en })"
      />
    </template>

    <template #column-left>
      <v-card-title>{{ $t('common.general') }}</v-card-title>
      <v-card-text>
        <v-simple-table dense class="custom-table">
          <template #default>
            <tbody>
              <data-row
                :title="$t('dataset.description')"
                :value="
                  $translate({
                    et: dataset.description,
                    en: dataset.description_en,
                  })
                "
              />
              <data-row
                :title="$t('dataset.author')"
                :value="dataset.owner__agent"
              />
              <data-row :title="$t('dataset.date')" :value="dataset.date_txt" />
              <data-row
                :title="$t('dataset.copyright')"
                :value="dataset.copyright_agent__agent"
              />
              <link-data-row
                :title="$t('dataset.licence')"
                :value="
                  $translate({
                    et: dataset.licence__licence,
                    en: dataset.licence__licence_en,
                  })
                "
                :href="
                  $translate({
                    et: dataset.licence__licence_url,
                    en: dataset.licence__licence_url_en,
                  })
                "
              />
              <data-row
                v-if="dataset.date_added"
                :title="$t('dataset.dateAdded')"
                :value="
                  new Date(dataset.date_added).toISOString().split('T')[0]
                "
              />
              <data-row
                v-if="dataset.date_changed"
                :title="$t('dataset.dateChanged')"
                :value="
                  new Date(dataset.date_changed).toISOString().split('T')[0]
                "
              />
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>

    <template #bottom>
      <v-card v-if="filteredTabs.length > 0" class="mt-6 mb-4">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </template>
  </detail>
</template>

<script>
import { isEmpty, isNil } from 'lodash'
import Tabs from '~/components/Tabs'
import PrevNextNavTitle from '~/components/PrevNextNavTitle'
import Detail from '~/components/templates/Detail.vue'
import DataRow from '~/components/DataRow.vue'
import LinkDataRow from '~/components/LinkDataRow.vue'
export default {
  components: {
    PrevNextNavTitle,
    Tabs,
    Detail,
    DataRow,
    LinkDataRow,
  },
  async asyncData({ params, route, error, app, redirect }) {
    try {
      const datasetResponse = await app.$services.sarvREST.getResource(
        'dataset',
        params.id
      )
      const ids = datasetResponse?.ids
      const dataset = datasetResponse.results[0]

      const tabs = [
        {
          id: 'dataset_analysis',
          table: 'dataset_analysis',
          routeName: 'dataset-id',
          title: 'dataset.analyses',
          count: 0,
          props: { dataset: dataset.id },
        },
        {
          id: 'dataset_reference',
          table: 'dataset_reference',
          routeName: 'dataset-id-references',
          title: 'dataset.references',
          count: 0,
          props: { dataset: dataset.id },
        },
        {
          id: 'attachments_link',
          table: 'attachment_link',
          routeName: 'dataset-id-attachments',
          title: 'dataset.attachments',
          count: 0,
          props: { dataset: dataset.id },
        },
      ]

      const solrParams = { fq: `dataset_id:${dataset.id}` }
      const apiParams = { dataset: dataset.id }

      const forLoop = async () => {
        const filteredTabs = tabs.filter((item) => !!item.id)
        for (const item of filteredTabs) {
          let countResponse
          if (item?.isSolr)
            countResponse = await app.$services.sarvSolr.getResourceCount(
              item.id,
              solrParams,
              'dataset'
            )
          else
            countResponse = await app.$services.sarvREST.getResourceCount(
              item.id,
              apiParams,
              'dataset'
            )
          item.count = countResponse?.count ?? 0
          item.props = {
            dataset: dataset.id,
          }
        }
      }
      await forLoop()

      const hydratedTabs = (
        await Promise.all(
          tabs.map(
            async (tab) =>
              await app.$hydrateCount(tab, {
                api: {
                  default: { dataset: dataset.id },
                },
              })
          )
        )
      ).map((tab) =>
        app.$populateProps(tab, {
          ...tab.props,
          dataset: dataset.id,
        })
      )

      // Find tab that has items
      const initTab = hydratedTabs.find((tab) => tab.count > 0)

      // Constuct route
      const path = initTab
        ? app.localePath({
            name: initTab.routeName,
            params: { id: dataset.id },
          })
        : route.path

      if (initTab && path !== route.path) redirect(path)

      return {
        dataset,
        ids,
        tabs: hydratedTabs,
        initActiveTab: path,
      }
    } catch (err) {
      error({
        message: `Could not find dataset ${route.params.id}`,
        path: route.path,
      })
    }
  },
  head() {
    return {
      title: this.$translate({
        et: this.dataset.name,
        en: this.dataset.name_en,
      }),
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },
  },
  methods: {
    isEmpty,
    isNil,
  },
}
</script>
