<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{ preparation.preparation_number }}
      </h1>
      <prev-next-nav />
      <v-card flat tile class="my-2">
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="6"
              style="max-width: 100%"
              class="pt-0 px-0 flex-grow-1 flex-shrink-0"
            >
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
                        :value="preparation.sample__number"
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
                          $openWindow(
                            `https://fossiilid.info/${preparation.taxon}`
                          )
                        "
                      />
                      <tr>
                        <td>{{ $t('preparation.preparation_number') }}</td>
                        <td>{{ preparation.preparation_number }}</td>
                      </tr>
                      <tr>
                        <td>{{ $t('preparation.preparation_number') }}</td>
                        <td>{{ preparation.preparation_number }}</td>
                      </tr>
                      <tr>
                        <td>{{ $t('preparation.preparation_number') }}</td>
                        <td>{{ preparation.preparation_number }}</td>
                      </tr>
                      <tr>
                        <td>{{ $t('preparation.preparation_number') }}</td>
                        <td>{{ preparation.preparation_number }}</td>
                      </tr>
                      <tr>
                        <td>{{ $t('preparation.preparation_number') }}</td>
                        <td>{{ preparation.preparation_number }}</td>
                      </tr>
                      <tr>
                        <td>{{ $t('preparation.preparation_number') }}</td>
                        <td>{{ preparation.preparation_number }}</td>
                      </tr>
                      <tr>
                        <td>{{ $t('preparation.preparation_number') }}</td>
                        <td>{{ preparation.preparation_number }}</td>
                      </tr>
                      <tr>
                        <td>{{ $t('preparation.preparation_number') }}</td>
                        <td>{{ preparation.preparation_number }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card v-if="filteredTabs.length > 0" class="mt-2 pb-2">
        <tabs :tabs="filteredTabs" :init-active-tab="initActiveTab" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isNil } from 'lodash'
import Tabs from '~/components/Tabs.vue'
import PrevNextNav from '~/components/PrevNextNav'
import DataRow from '~/components/DataRow'
import LinkDataRow from '~/components/LinkDataRow'

export default {
  components: { LinkDataRow, DataRow, PrevNextNav, Tabs },
  async asyncData({ params, route, error, app }) {
    try {
      const detailViewResponse = await app.$services.sarvREST.getResource(
        'preparation',
        params.id
      )
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
          routeName: 'preparation-id-taxon_list',
          title: 'preparation.samples',
          count: 0,
          props: {},
        },
        {
          id: 'analysis',
          isSolr: true,
          routeName: 'preparation-id-analyses',
          title: 'preparation.analyses',
          count: 0,
          props: {},
        },
        {
          id: 'specimen',
          isSolr: true,
          routeName: 'preparation-id-specimens',
          title: 'preparation.specimens',
          count: 0,
          props: {},
        },
      ]

      return {
        preparation,
        initActiveTab: route.path,
        tabs: (
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
            site: preparation.id,
          })
        ),
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
