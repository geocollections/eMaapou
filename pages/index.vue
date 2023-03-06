<template>
  <div>
    <div
      class="spacer pt-16"
      :style="{
        'background-image': backgroundImage,
        'background-color': '#333333',
        height: topHeight,
      }"
    >
      <v-container
        :fluid="$vuetify.breakpoint.smAndDown"
        style="max-width: 1185px !important"
      >
        <v-row class="mb-lg-5">
          <v-col>
            <div class="pt-sm-4 pt-md-8" :style="{ 'max-width': '1000px' }">
              <i18n
                path="title"
                tag="div"
                class="text-h3 text-sm-h2 text-md-h1 white--text font-weight-bold"
              >
              </i18n>
              <span
                class="text-h5 text-sm-h4 text-md-h3 font-weight-light white--text"
              >
                {{ $t('subtitle') }}
              </span>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="5">
            <v-card
              class=""
              :width="$vuetify.breakpoint.lgAndUp ? '660px' : 'unset'"
              tile
              flat
              color="transparent"
            >
              <v-card-actions class="px-0 pt-md-6">
                <v-form
                  class="d-flex text-right"
                  style="width: 100%"
                  @submit.prevent="handleSearch"
                >
                  <input-search
                    v-model="query"
                    input-class="rounded"
                    style="display: contents"
                    height="56"
                    :placeholder="$t('landing.searchPlaceholder')"
                  />
                  <v-btn
                    height="56px"
                    width="84px"
                    class="text-body-1 ml-2 ml-sm-3 mt-0 mt-sm-0"
                    type="submit"
                    color="warning"
                    dark
                  >
                    <v-icon>{{ icons.mdiMagnify }}</v-icon>
                  </v-btn>
                </v-form>
              </v-card-actions>
              <v-card-title
                v-show="$vuetify.breakpoint.mdAndUp"
                style="word-break: break-word"
                :class="{
                  'font-small montserrat': $vuetify.breakpoint.smAndDown,
                }"
                class="text-sm-h6 font-weight-regular white--text pr-0 pl-1"
              >
                {{ $t('landing.description') }}
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" md="7" class="pl-lg-10">
            <v-card color="transparent" flat>
              <v-row no-gutters justify="center">
                <div class="col-12 col-xl-auto d-flex flex-wrap">
                  <v-col
                    v-for="(route, index) in searchRoutes"
                    :key="`${route.routeName}-${index}`"
                    cols="12"
                    class="pa-0"
                    sm="6"
                    md="6"
                    lg="6"
                  >
                    <card-route-link :route="route" />
                  </v-col>
                </div>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container
      :fluid="$vuetify.breakpoint.smAndDown"
      style="max-width: 1185px !important"
    >
      <v-row justify="center" class="mt-4">
        <v-col cols="12" md="8" class="pr-5" order="1" order-md="0">
          <the-news-card />
        </v-col>
        <v-col cols="12" md="4" class="pl-lg-5" order="0" order-md="0">
          <base-header class="pb-2" :title="$t('landing.otherServices')" />

          <v-row no-gutters>
            <v-col
              v-for="(route, index) in otherServices.ids.map(
                (id) => otherServices[id]
              )"
              :key="`external-card-${index}`"
              cols="12"
              lg="12"
              class="pb-2 px-1"
            >
              <card-external-service :route="route" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {
  mdiMagnify,
  mdiMapMarker,
  mdiScrewMachineFlatTop,
  mdiChartLine,
  mdiFileImageOutline,
  mdiBug,
  mdiImageFilterHdr,
} from '@mdi/js'
import BaseHeader from '~/components/base/BaseHeader.vue'
import TheNewsCard from '~/components/landing/TheNewsCard.vue'
import CardExternalService from '~/components/card/CardExternalService.vue'
import CardRouteLink from '~/components/card/CardRouteLink.vue'
import InputSearch from '~/components/input/InputSearch.vue'

export default {
  components: {
    BaseHeader,
    TheNewsCard,
    CardExternalService,
    CardRouteLink,
    InputSearch,
  },
  layout: 'landing',
  data() {
    return {
      query: '',
      otherServices: {
        geocollections: {
          title: 'geocollections.title',
          description: 'geocollections.description',
          href: 'https://geocollections.info',
        },
        kirjandus: {
          title: 'kirjandus.title',
          description: 'kirjandus.description',
          href: 'https://kirjandus.geoloogia.info',
        },
        gmre: {
          title: 'gmre.title',
          description: 'gmre.description',
          href: 'https://geoloogia.info/geology',
        },
        fond: {
          title: 'fond.title',
          description: 'fond.description',
          href: 'https://fond.egt.ee',
        },
        fossiilid: {
          title: 'fossiilid.title',
          description: 'fossiilid.description',
          href: 'https://fossiilid.info',
        },
        kivid: {
          title: 'kivid.title',
          description: 'kivid.description',
          href: 'https://kivid.info',
        },
        stratigraphy: {
          title: 'frontStratigraphy.title',
          description: 'frontStratigraphy.description',
          href: 'https://stratotuup.ut.ee',
        },
        maardlad: {
          title: 'maardlad.title',
          description: 'maardlad.description',
          href: 'https://geoportaal.maaamet.ee/est/Ruumiandmed/Geoloogilised-andmed-p115.html',
        },
        doi: {
          title: 'doi.title',
          description: 'doi.description',
          href: 'https://doi.geocollections.info',
        },
        turba: {
          title: 'turba.title',
          description: 'turba.description',
          href: 'https://turba.geoloogia.info',
        },
        // Divider
        geocase: {
          title: 'geocase.title',
          description: 'geocase.description',
          href: 'https://geocase.eu',
        },
        eurocore: {
          title: 'eurocore.title',
          description: 'eurocore.description',
          href: 'https://eurocore.rocks',
        },
        sarv: {
          title: 'sarv.title',
          description: 'sarv.description',
          href: 'https://edit.geocollections.info',
        },
        ids: [
          'kirjandus',
          'fossiilid',
          'kivid',
          'fond',
          'maardlad',
          'stratigraphy',
          'gmre',
          'turba',
          'geocase',
          'eurocore',
          'geocollections',
          'doi',
          'sarv',
        ],
      },
      searchRoutes: [],
    }
  },
  async fetch() {
    const [
      specimenResponse,
      analysisResponse,
      sampleResponse,
      localityResponse,
      photoResponse,
      drillcoreResponse,
    ] = await Promise.all([
      this.$services.sarvSolr
        .getResourceList('specimen', {
          defaultParams: { rows: 0 },
        })
        .catch((_) => {
          return { count: 284000 }
        }),
      this.$services.sarvSolr
        .getResourceList('analysis', {
          defaultParams: { rows: 0 },
        })
        .catch((_) => {
          return { count: 249000 }
        }),
      this.$services.sarvSolr
        .getResourceList('sample', {
          defaultParams: { rows: 0 },
        })
        .catch((_) => {
          return { count: 156000 }
        }),
      this.$services.sarvSolr
        .getResourceList('locality', {
          defaultParams: { rows: 0 },
        })
        .catch((_) => {
          return { count: 13000 }
        }),
      this.$services.sarvSolr
        .getResourceList('attachment', {
          defaultParams: { rows: 0, fq: 'specimen_image_attachment:"2"' },
        })
        .catch((_) => {
          return { count: 20000 }
        }),
      this.$services.sarvSolr
        .getResourceList('drillcore', {
          defaultParams: { rows: 0 },
        })
        .catch((_) => {
          return { count: 500 }
        }),
    ])

    this.searchRoutes = [
      {
        routeName: 'specimen',
        text: 'specimen.landingCard',
        icon: mdiBug,
        count: specimenResponse.count,
      },
      {
        routeName: 'locality',
        text: 'locality.landingCard',
        icon: mdiMapMarker,
        count: localityResponse.count,
      },
      {
        routeName: 'sample',
        text: 'sample.landingCard',
        icon: mdiImageFilterHdr,
        count: sampleResponse.count,
      },
      {
        routeName: 'drillcore',
        text: 'drillcore.landingCard',
        icon: mdiScrewMachineFlatTop,
        count: drillcoreResponse.count,
      },
      {
        routeName: 'analytical-data',
        text: 'analyticalData.landingCard',
        icon: mdiChartLine,
        count: analysisResponse.count,
      },
      {
        routeName: 'photo',
        text: 'photo.landingCard',
        icon: mdiFileImageOutline,
        count: photoResponse.count,
      },
    ]
  },
  head() {
    return {
      title: this.$t('landing.title'),
      link: [
        {
          rel: 'preload',
          as: 'image',
          href: this.backgroundSvg,
        },
        {
          rel: 'preload',
          as: 'image',
          href: this.backgroundImg,
        },
      ],
    }
  },
  computed: {
    icons() {
      return {
        mdiMagnify,
      }
    },
    backgroundImg() {
      return this.$img('/frontpage/header_img2.jpg')
    },
    backgroundSvg() {
      return this.$img('/frontpage/layered-peaks-haikei.svg')
    },
    backgroundImage() {
      return `url(${this.backgroundSvg}), url(${this.backgroundImg})`
    },
    topHeight() {
      if (this.$vuetify.breakpoint.smAndUp) return '675px'
      return '650px'
    },
  },
  methods: {
    handleSearch() {
      this.$router.push(
        this.localePath({ name: 'search', query: { q: this.query } })
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/_variables';

.spacer {
  aspect-ratio: 900/600;
  width: 100%;
  background-repeat: no-repeat;
  background-position: bottom, center;
  background-size: cover, cover;

  @media #{map-get($display-breakpoints, 'xl-only')} {
    background-position: bottom -5rem right, center;
  }
}
</style>
