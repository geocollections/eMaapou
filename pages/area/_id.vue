<template>
  <v-row>
    <v-col>
      <h1 class="text-center my-3 page-title">
        {{ $translate({ et: area.name, en: area.name_en }) }}
      </h1>
      <v-card class="my-2" flat tile>
        <v-card-title>{{ $t('common.general') }}</v-card-title>
        <v-card-text class="px-0">
          <v-simple-table dense class="custom-table">
            <template #default>
              <tbody>
                <tr>
                  <td>{{ $t('area.name') }}</td>
                  <td>
                    {{ $translate({ et: area.name, en: area.name_en }) }}
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('area.areaType') }}</td>
                  <td
                    v-if="
                      isNil(
                        $translate({
                          et: area.area_type__name,
                          en: area.area_type__name_en,
                        })
                      )
                    "
                    class="no-value"
                  >
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>
                    <a
                      v-if="area.area_type === 2"
                      class="text-link"
                      @click="$openTurba('turbaala', area.id)"
                    >
                      {{
                        $translate({
                          et: area.area_type__name,
                          en: area.area_type__name_en,
                        })
                      }}
                      <v-icon small color="deep-orange darken-2"
                        >mdi-open-in-new</v-icon
                      >
                    </a>
                    <div v-else>
                      {{
                        $translate({
                          et: area.area_type__name,
                          en: area.area_type__name_en,
                        })
                      }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('area.maakond') }}</td>
                  <td
                    v-if="
                      isNil(
                        $translate({
                          et: area.maakond__maakond,
                          en: area.maakond__maakond_en,
                        })
                      )
                    "
                    class="no-value"
                  >
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>
                    {{
                      $translate({
                        et: area.maakond__maakond,
                        en: area.maakond__maakond_en,
                      })
                    }}
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('area.areaHa') }}</td>
                  <td v-if="isNil(area.area_ha)" class="no-value">
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>
                    {{ area.area_ha }}
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('area.depositAreaHa') }}</td>
                  <td v-if="isNil(area.deposit_area_ha)" class="no-value">
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>
                    {{ area.deposit_area_ha }}
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('area.description') }}</td>
                  <td
                    v-if="
                      isNil(
                        $translate({
                          et: area.description,
                          en: area.description_en,
                        })
                      )
                    "
                    class="no-value"
                  >
                    {{ $t('common.noValue') }}
                  </td>
                  <!-- eslint-disable vue/no-v-html -->
                  <td
                    v-else
                    v-html="
                      $translate({
                        et: area.description,
                        en: area.description_en,
                      })
                    "
                  />
                  <!-- eslint-enable -->
                </tr>
                <tr>
                  <td>{{ $t('area.egf') }}</td>
                  <td v-if="isNil(area.egf)" class="no-value">
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>
                    <span v-for="(item, index) in egfArray" :key="index">
                      <a class="text-link" @click="$openEgf(item)">
                        {{ item }}
                      </a>
                      <span v-if="index !== egfArray.length - 1" class="mr-1"
                        >|</span
                      >
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('area.maardla') }}</td>

                  <td v-if="isNil(area.maardla)" class="no-value">
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>
                    <a class="text-link" @click="$openDeposit(area.maardla)">
                      {{ $t('area.maardlaLink') }} ({{ area.maardla }})
                    </a>
                  </td>
                </tr>

                <tr>
                  <td>{{ $t('area.eelis') }}</td>
                  <td v-if="isNil(area.eelis)" class="no-value">
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>
                    <span v-for="(item, index) in eelisArray" :key="index">
                      <a class="text-link" @click="$openEelis(item)">
                        {{ item }}
                      </a>
                      <span v-if="index !== eelisArray.length - 1" class="mr-1"
                        >|</span
                      >
                    </span>
                  </td>
                </tr>
                <tr v-if="area.area_type === 2">
                  <td>{{ $t('area.text1') }}</td>
                  <td v-if="isNil(area.text1)" class="no-value">
                    {{ $t('common.noValue') }}
                  </td>
                  <td v-else>
                    <span v-for="(item, index) in planArray" :key="index">
                      <a
                        class="text-link"
                        :download="item.trim()"
                        @click="$openTurba('plaanid', item.trim(), false)"
                      >
                        {{ item }}
                        <v-icon small color="deep-orange darken-2"
                          >mdi-file-download-outline</v-icon
                        >
                      </a>
                      <span v-if="index !== planArray.length - 1" class="mr-1"
                        >|</span
                      >
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('area.id') }}</td>
                  <td>{{ area.id }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card v-if="filteredTabs.length > 0" class="mt-2 pb-2">
        <tabs :tabs="tabs" :init-active-tab="initActiveTab" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { isNil } from 'lodash'
import Tabs from '~/components/Tabs.vue'

export default {
  components: { Tabs },
  layout: 'detail',
  async asyncData({ params, route, error, app }) {
    try {
      const detailViewResponse = await app.$services.sarvREST.getResource(
        'area',
        params.id
      )
      const area = detailViewResponse.results[0]

      const tabs = [
        {
          id: 'site',
          isSolr: true,
          routeName: 'area-id',
          title: 'area.sites',
          count: 0,
          props: {},
        },
        {
          id: 'locality_reference',
          routeName: 'area-id-references',
          title: 'area.localityReferences',
          count: 0,
          props: {},
        },
      ]
      // FIXME: If check seems unneccessary
      if (area?.id) {
        const solrParams = { fq: `area_id:${area.id}` }
        const apiParams = { area: area.id }

        const forLoop = async () => {
          const filteredTabs = tabs.filter((item) => !!item.id)
          for (const item of filteredTabs) {
            let countResponse
            if (item?.isSolr)
              countResponse = await app.$services.sarvSolr.getResourceCount(
                item.id,
                solrParams
              )
            else
              countResponse = await app.$services.sarvREST.getResourceCount(
                item.id,
                apiParams
              )
            item.count = countResponse?.count ?? 0
            item.props = {
              area: area.id,
            }
          }
        }
        await forLoop()
      }

      return {
        area,
        initActiveTab: route.path,
        tabs,
      }
    } catch (err) {
      error({
        message: `Could not find area ${route.params.id}`,
        path: route.path,
      })
    }
  },
  head() {
    return {
      title: this.$translate({
        et: this.area.name,
        en: this.area.name_en,
      }),
    }
  },
  computed: {
    filteredTabs() {
      return this.tabs.filter((item) => item.count > 0)
    },

    eelisArray() {
      if (this.area.eelis) {
        if (this.area.eelis.includes(';')) {
          return this.area.eelis.split(';')
        } else return [this.area.eelis]
      } else return []
    },

    egfArray() {
      if (this.area.egf) {
        if (this.area.egf.includes(';')) {
          return this.area.egf.split(';')
        } else return [this.area.egf]
      } else return []
    },

    planArray() {
      if (this.area.text1) {
        if (this.area.text1.includes(',')) {
          return this.area.text1.split(',')
        } else return [this.area.text1]
      } else return []
    },
  },
  methods: {
    isNil,
  },
}
</script>
