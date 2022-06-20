<template>
  <div class="mb-10">
    <div
      class="spacer pd-md-4"
      style="padding-top: 64px"
      :style="{
        'background-image': cssProps.background,
        'background-color': '#333333',
        height: getTopHeight(),
      }"
    >
      <v-container
        :fluid="$vuetify.breakpoint.smAndDown"
        style="max-width: 1185px !important"
      >
        <v-row class="mb-lg-5">
          <v-col>
            <div
              class="d-flex pt-sm-4 pt-md-8"
              :style="{ 'max-width': '1000px' }"
            >
              <div class="text-h4 text-md-h2 white--text font-weight-bold">
                {{ $t('title') }}:
                <span class="text-h4 text-md-h2 font-weight-light white--text">
                  {{ $t('subtitle') }}
                </span>
              </div>
              <!-- SUBTITLE -->
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
              <v-card-actions class="px-0 pt-md-10">
                <search-form-quick
                  style="width: 100%"
                  :only-icon="$vuetify.breakpoint.smAndDown"
                  @submit="handleSearch"
                />
              </v-card-actions>
              <v-card-title
                v-show="$vuetify.breakpoint.mdAndUp"
                style="word-break: break-word"
                :class="{
                  'font-small montserrat': $vuetify.breakpoint.smAndDown,
                }"
                class="text-sm-h5 white--text pr-0"
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
      class=""
      :fluid="$vuetify.breakpoint.smAndDown"
      style="max-width: 1185px !important"
    >
      <v-row justify="center" class="mt-4">
        <v-col cols="12" md="8" class="pr-5">
          <client-only>
            <the-news-card />
          </client-only>
        </v-col>
        <v-col cols="12" md="4" class="pl-lg-5">
          <base-header :title="$t('landing.otherServices')" />

          <v-row no-gutters>
            <v-col
              v-for="(route, index) in externalCards.ids.map(
                (id) => externalCards[id]
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
import isEmpty from 'lodash/isEmpty'
import SearchFormQuick from '~/components/search/forms/SearchFormQuick.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import TheNewsCard from '~/components/landing/TheNewsCard.vue'
import CardExternalService from '~/components/card/CardExternalService.vue'
import CardRouteLink from '~/components/card/CardRouteLink.vue'

export default {
  components: {
    SearchFormQuick,
    BaseHeader,
    TheNewsCard,
    CardExternalService,
    CardRouteLink,
  },
  layout: 'landing',
  async asyncData({ route, error, app }) {
    const data = await app.$services.sarvREST.getResource('web_pages', 87)

    const [
      specimenResponse,
      analysisResponse,
      sampleResponse,
      localityResponse,
      photoResponse,
      drillcoreResponse,
    ] = await Promise.all([
      app.$services.sarvSolr
        .getResourceList('specimen', {
          defaultParams: { rows: 0 },
        })
        .catch((_) => {
          return {}
        }),
      app.$services.sarvSolr
        .getResourceList('analysis', {
          defaultParams: { rows: 0 },
        })
        .catch((_) => {
          return {}
        }),
      app.$services.sarvSolr
        .getResourceList('sample', {
          defaultParams: { rows: 0 },
        })
        .catch((_) => {
          return {}
        }),
      app.$services.sarvSolr
        .getResourceList('locality', {
          defaultParams: { rows: 0 },
        })
        .catch((_) => {
          return {}
        }),
      app.$services.sarvSolr
        .getResourceList('attachment', {
          defaultParams: { rows: 0, fq: 'specimen_image_attachment:"2"' },
        })
        .catch((_) => {
          return {}
        }),
      app.$services.sarvSolr
        .getResourceList('drillcore', {
          defaultParams: { rows: 0 },
        })
        .catch((_) => {
          return {}
        }),
    ])

    return {
      searchRoutes: [
        {
          routeName: 'specimen',
          text: 'specimen.landingCard',
          icon: 'mdi-microscope',
          count: specimenResponse?.count ?? 284000,
        },
        {
          routeName: 'locality',
          text: 'locality.landingCard',
          icon: 'mdi-map-marker-outline',
          count: localityResponse?.count ?? 13000,
        },
        {
          routeName: 'sample',
          text: 'sample.landingCard',
          icon: 'mdi-test-tube',
          count: sampleResponse?.count ?? 156000,
        },
        {
          routeName: 'drillcore',
          text: 'drillcore.landingCard',
          icon: 'mdi-screw-machine-flat-top',
          count: drillcoreResponse?.count ?? 500,
        },
        {
          routeName: 'analytical-data',
          text: 'analyticalData.landingCard',
          icon: 'mdi-chart-line',
          count: analysisResponse?.count ?? 249000,
        },
        {
          routeName: 'photo',
          text: 'photo.landingCard',
          icon: 'mdi-file-image-outline',
          count: photoResponse?.count ?? 20000,
        },
      ],
      page: data,
    }
  },
  data() {
    return {
      logo: '/logos/emaapou5white.svg',
      drawer: false,
      showMap: false,
      scrollY: 0,
      externalRoutes: [
        {
          text: 'kirjandus.title',
          href: 'https://kirjandus.geoloogia.info',
          icon: 'mdi-book-open-page-variant-outline',
          description: 'kirjandus.description',
        },
        {
          text: 'fossiilid.title',
          href: 'https://fossils.info',
          icon: 'mdi-chart-line',
          description: 'fossiilid.description',
        },
        {
          text: 'stratigraphy.title',
          href: 'https://stratigraafia.info',
          icon: 'mdi-layers-triple',
          description: 'stratigraphy.description',
        },
      ],
      imageLinks: [
        {
          href: 'https://taltech.ee/geoloogia-instituut',
          src: '/logos/tutaltech2.png',
          title: 'footerLinks.ttu',
          alt: 'footerLinks.ttu',
        },
        {
          href: 'http://www.natmuseum.ut.ee/et/content/geoloogiakogud',
          src: '/logos/TY_logo_ring_jooneta_valge.png',
          title: 'footerLinks.tu',
          alt: 'footerLinks.tu',
        },
        {
          href: 'https://loodusmuuseum.ee/geoloogilised-kogud',
          src: '/logos/ELM_logo_white1.png',
          title: 'footerLinks.elm',
          alt: 'footerLinks.elm',
        },
        /* {
          href: 'https://struktuurifondid.ee',
          src: '/logos/EL_mv.png',
          title: 'footerLinks.el',
          alt: 'footerLinks.el',
        }, */
      ],
      externalCards: {
        geocollections: {
          title: 'geocollections.title',
          description: 'geocollections.description',
          href: 'https://geocollections.info',
          background: '/frontpage/geokogud.jpg',
          sm: 6,
          md: 4,
          lg: 4,
        },
        kirjandus: {
          title: 'kirjandus.title',
          description: 'kirjandus.description',
          href: 'https://kirjandus.geoloogia.info',
          background: '/frontpage/geokirjandus.jpg',
          sm: 6,
          md: 4,
          lg: 4,
        },
        gmre: {
          title: 'gmre.title',
          description: 'gmre.description',
          href: 'https://geoloogia.info/geology',
          background: '/frontpage/gmre.jpg',
          sm: 6,
          md: 3,
          lg: 3,
        },
        fond: {
          title: 'fond.title',
          description: 'fond.description',
          href: 'https://fond.egt.ee',
          background: '/frontpage/geoloogiafond.jpg',
          sm: 6,
          md: 3,
          lg: 3,
        },
        // Divider
        fossiilid: {
          title: 'fossiilid.title',
          description: 'fossiilid.description',
          href: 'https://fossiilid.info',
          background: '/frontpage/fossiilid.jpg',
          sm: 6,
          md: 4,
          lg: 4,
        },
        kivid: {
          title: 'kivid.title',
          description: 'kivid.description',
          href: 'https://kivid.info',
          background: '/frontpage/kivid.jpg',
          sm: 6,
          md: 4,
          lg: 4,
        },
        stratigraphy: {
          title: 'frontStratigraphy.title',
          description: 'frontStratigraphy.description',
          href: 'https://stratotuup.ut.ee',
          background: '/frontpage/stratigraafia.jpg',
          sm: 6,
          md: 3,
          lg: 3,
        },
        // Divider
        maardlad: {
          title: 'maardlad.title',
          description: 'maardlad.description',
          href: 'https://geoportaal.maaamet.ee/est/Ruumiandmed/Geoloogilised-andmed-p115.html',
          background: '/frontpage/maardlad.jpg',
          sm: 6,
          md: 6,
          lg: 6,
        },
        doi: {
          title: 'doi.title',
          description: 'doi.description',
          href: 'https://doi.geocollections.info',
          background: '/frontpage/sarv-doi.jpg',
          sm: 6,
          md: 4,
          lg: 4,
        },
        turba: {
          title: 'turba.title',
          description: 'turba.description',
          href: 'https://turba.geoloogia.info',
          background: '/frontpage/turba.jpg',
          sm: 6,
          md: 3,
          lg: 3,
        },
        // Divider
        geocase: {
          title: 'geocase.title',
          description: 'geocase.description',
          href: 'https://geocase.eu',
          background: '/frontpage/geocase.jpg',
          sm: 6,
          md: 3,
          lg: 3,
        },
        eurocore: {
          title: 'eurocore.title',
          description: 'eurocore.description',
          href: 'https://eurocore.rocks',
          background: '/frontpage/eurocore.jpg',
          sm: 6,
          md: 3,
          lg: 3,
        },
        sarv: {
          title: 'sarv.title',
          description: 'sarv.description',
          href: 'https://edit.geocollections.info',
          background: '/frontpage/sarv-wb.jpg',
          sm: 6,
          md: 4,
          lg: 4,
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
        innerIds: [
          'kirjandus',
          'doi',
          'geocollections',
          'fossiilid',
          'kivid',
          'sarv',
        ],
        outerIds: [
          'fond',
          'maardlad',
          'stratigraphy',
          'gmre',
          'turba',
          'geocase',
          'eurocore',
        ],
      },
      backgroundImg: this.$img('/frontpage/header_img2.jpg'),
      backgroundSvg: this.$img('/frontpage/layered-peaks-haikei.svg'),
    }
  },
  head() {
    return {
      title: this.$t('landing.title'),
      link: [
        {
          rel: 'preload',
          as: 'image',
          href: `${this.backgroundSvg}`,
        },
        {
          rel: 'preload',
          as: 'image',
          href: `${this.backgroundImg}`,
        },
      ],
    }
  },
  computed: {
    cssProps() {
      return {
        background: `url(${this.backgroundSvg}), url(${this.backgroundImg})`,
      }
    },
    tabValue() {
      // https://github.com/vuetifyjs/vuetify/issues/12265
      const path = this.$route.path
      const full = this.$route.fullPath
      return path[path.length - 1] !== '/'
        ? `${path}/${full.substring(path.length)}`
        : `${full}/`
    },
    aboutTextColumns() {
      if (this.$vuetify.breakpoint.lgAndUp) return 1
      if (this.$vuetify.breakpoint.mdOnly) return 2
      return 1
    },
    renderSideCard() {
      return this.$vuetify.breakpoint.mdAndUp
    },
  },
  watch: {
    '$vuetify.breakpoint.mdAndUp'(newVal, oldVal) {
      if (newVal === false) this.showMap = false
    },
  },
  beforeMount() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      // Your scroll handling here
      this.scrollY = window.scrollY
    },
    handleSearch() {
      const routeName = this.$route.name.includes('search')
        ? this.$route.name.split('__')[0]
        : 'search'
      const query = isEmpty(this.search)
        ? { ...this.$route.query }
        : { ...this.$route.query, q: this.search }
      this.$router.push(this.localePath({ name: routeName, query }))
    },
    getTopHeight() {
      if (this.$vuetify.breakpoint.lgAndUp) return '675px'
      if (this.$vuetify.breakpoint.mdOnly) return '675px'
      if (this.$vuetify.breakpoint.smOnly) return '675px'
      return '750px'
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

.layer1 {
  background-image: var(--background);
}

.quick-card {
  :hover {
    color: red;
  }
}

// OLD

.background-image ::v-deep > .v-image__image {
  filter: brightness(0.95) !important;
}

.footer-logo {
  height: 60px;
  width: auto;
  /*padding: 0 10px;*/
}
// .v-image ::v-deep .v-responsive__content {
//   align-self: center;
// }
.pulse {
  animation: pulse 2s infinite;
  @keyframes pulse {
    0% {
      padding-bottom: 30px;
    }
    70% {
      padding-bottom: 0px;
    }
    100% {
      opacity: 0;
    }
  }
}
.shape-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.shape-divider svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 50px;
}

.shape-divider .shape-fill {
  fill: #f7f6f4;
}

.text-sm-h3 {
  color: #577daf;
  font-weight: bold !important;
}
</style>
