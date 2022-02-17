<template>
  <div class="mb-10">
    <div
      class="spacer layer1"
      :style="{ height: $vuetify.breakpoint.lgAndUp ? '750px' : 'auto' }"
    >
      <v-container :fluid="$vuetify.breakpoint.smAndDown">
        <v-row class="px-3" justify="space-around">
          <v-col cols="12" lg="6">
            <div class="d-flex flex-column pt-8">
              <div class="text-h5 text-md-h4 white--text font-weight-regular">
                {{ $t('title') }}
              </div>
              <!-- SUBTITLE -->
              <div
                class="
                  mt-3
                  text-h4 text-md-h2
                  font-weight-bold
                  align-center
                  white--text
                "
              >
                {{ $t('subtitle') }}
              </div>
              <div>
                <v-card
                  :width="$vuetify.breakpoint.lgAndUp ? '660px' : 'unset'"
                  class="mt-3 mt-md-6"
                  tile
                  flat
                  color="transparent"
                >
                  <v-card-title
                    style="word-break: break-word"
                    :class="{
                      'font-small montserrat': $vuetify.breakpoint.smAndDown,
                    }"
                    class="px-0 text-sm-h5 white--text"
                  >
                    {{ $t('landing.quickSearch') }}
                  </v-card-title>
                  <v-card-actions class="pa-0">
                    <search-form-quick
                      style="width: 100%"
                      :only-icon="$vuetify.breakpoint.smAndDown"
                      @submit="handleSearch"
                    />
                  </v-card-actions>
                </v-card>
              </div>
            </div>
            <v-row no-gutters class="mt-8">
              <div
                class="col-12 col-xl-auto d-flex flex-wrap"
                :style="{
                  'max-width': $vuetify.breakpoint.xlOnly ? '660px' : 'unset',
                }"
              >
                <v-col
                  v-for="(route, index) in searchRoutes"
                  :key="index"
                  cols="12"
                  class="pa-0"
                  sm="6"
                  md="4"
                  lg="6"
                >
                  <v-hover v-slot="{ hover }">
                    <v-card
                      nuxt
                      :to="localePath(route.routeName)"
                      class="ma-1"
                      :class="{ 'on-hover': hover }"
                    >
                      <v-card-title
                        class=""
                        :class="{
                          'text-body-1 font-weight-medium':
                            $vuetify.breakpoint.smAndDown,
                        }"
                      >
                        <v-icon
                          :x-large="$vuetify.breakpoint.mdAndUp"
                          color="accent"
                          >{{ route.icon }}</v-icon
                        >
                        <div class="montserrat ml-3">
                          {{ $t(route.text) }}
                        </div>
                      </v-card-title>
                    </v-card>
                    <!-- <v-card
                      nuxt
                      :to="localePath(route.routeName)"
                      :width="$vuetify.breakpoint.lgAndUp ? '210px' : 'auto'"
                      :height="$vuetify.breakpoint.lgAndUp ? '200px' : 'auto'"
                      class="ma-1 d-flex flex-column justify-center"
                      :class="{ 'on-hover': hover }"
                    >
                      <v-card-title
                        class="justify-center pb-0"
                        :class="{
                          'text-body-2 font-weight-medium':
                            $vuetify.breakpoint.smAndDown,
                        }"
                      >
                        <div class="montserrat">
                          {{ $t(route.text) }}
                        </div>
                      </v-card-title>
                      <v-card-text class="text-center py-6">
                        <v-icon color="accent" x-large>{{ route.icon }}</v-icon>
                      </v-card-text>
                    </v-card> -->
                  </v-hover>
                </v-col>
              </div>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            lg="6"
            class="d-flex flex-column justify-space-between"
          >
            <the-map-card v-if="$vuetify.breakpoint.lgAndUp" class="mt-8" />
            <v-card class="mt-5" color="tertiary">
              <v-card-text class="white--text d-md-flex justify-md-center">
                <div class="px-md-10 py-4">
                  <div class="text-h6 text-center font-weight-regular pb-3">
                    Number of records
                  </div>
                  <div class="text-h6 text-center">1000000</div>
                </div>
                <v-divider
                  style="border-color: white !important"
                  :vertical="$vuetify.breakpoint.mdAndUp"
                />
                <div class="px-md-10 py-4">
                  <div class="text-h6 text-center font-weight-regular pb-3">
                    Number of records
                  </div>
                  <div class="text-h6 text-center">1000000</div>
                </div>
                <v-divider
                  style="border-color: white !important"
                  :vertical="$vuetify.breakpoint.mdAndUp"
                />
                <div class="px-md-10 py-4">
                  <div class="text-h6 text-center font-weight-regular pb-3">
                    Number of records
                  </div>
                  <div class="text-h6 text-center">1000000</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container class="pt-0" :fluid="$vuetify.breakpoint.smAndDown">
      <v-row justify="center" class="mt-4">
        <v-col cols="12" lg="6" class="pr-5">
          <client-only>
            <the-news-card />
          </client-only>
        </v-col>
        <v-col cols="12" lg="6" class="pl-5">
          <base-header :title="$t('about.title')" />

          <div
            class="aboutpage px-2 px-sm-5"
            :style="{ 'column-count': aboutTextColumns }"
            v-html="$translate({ et: page.content_et, en: page.content_en })"
          ></div>
        </v-col>
      </v-row>
      <!-- <v-row no-gutters class="my-2" justify="center" align="center">
        <v-col id="otherServices" class="py-0" cols="12">
          <base-header :title="$t('landing.otherPages')" />
        </v-col>
        <v-col cols="12">
          <v-row class="px-2 px-sm-5">
            <v-col
              v-for="(item, index) in externalCards.ids.map(
                (id) => externalCards[id]
              )"
              :key="`inner-${index}`"
              class="pa-1"
              cols="12"
              :sm="item.sm || 6"
              :md="item.md || 6"
            >
              <external-link-card
                :title="$t(item.title)"
                :description="$t(item.description)"
                :href="item.href"
                :background="
                  $img(item.background, null, { provider: 'static' })
                "
                grayscale
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row> -->
    </v-container>
  </div>
</template>

<script>
import { isEmpty } from 'lodash'
import SearchFormQuick from '~/components/search/forms/SearchFormQuick.vue'
import TheMapCard from '~/components/landing/TheMapCard.vue'
import BaseHeader from '~/components/base/BaseHeader.vue'
import TheNewsCard from '~/components/landing/TheNewsCard.vue'
// import ExternalLinkCard from '~/components/ExternalLinkCard.vue'

export default {
  components: {
    SearchFormQuick,
    TheMapCard,
    BaseHeader,
    TheNewsCard,
    // ExternalLinkCard,
  },
  layout: 'landing',
  async asyncData({ route, error, app }) {
    const data = await app.$services.sarvREST.getResource('web_pages', 87)
    return { page: data }
  },
  data() {
    return {
      logo: '/logos/emaapou5white.svg',
      drawer: false,
      showMap: false,
      scrollY: 0,
      searchRoutes: [
        {
          routeName: 'locality',
          text: 'locality.pageTitle',
          icon: 'mdi-map-marker-outline',
        },
        {
          routeName: 'site',
          text: 'site.pageTitle',
          icon: 'mdi-binoculars',
        },
        {
          routeName: 'drillcore',
          text: 'drillcore.pageTitle',
          icon: 'mdi-screw-machine-flat-top',
        },
        {
          routeName: 'sample',
          text: 'sample.pageTitle',
          icon: 'mdi-test-tube',
        },
        {
          routeName: 'analysis',
          text: 'analysis.pageTitle',
          icon: 'mdi-chart-scatter-plot',
        },
        {
          routeName: 'analytical-data',
          text: 'analyticalData.pageTitle',
          icon: 'mdi-chart-line',
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
          md: 4,
          lg: 4,
        },
        // Divider
        fossiilid: {
          title: 'fossiilid.title',
          description: 'fossiilid.description',
          href: 'https://fossiilid.info',
          background: '/frontpage/fossiilid.jpg',
          sm: 6,
          md: 3,
          lg: 3,
        },
        kivid: {
          title: 'kivid.title',
          description: 'kivid.description',
          href: 'https://kivid.info',
          background: '/frontpage/kivid.jpg',
          sm: 6,
          md: 6,
          lg: 6,
        },
        stratigraphy: {
          title: 'frontStratigraphy.title',
          description: 'frontStratigraphy.description',
          href: 'https://stratotuup.ut.ee',
          background: '/frontpage/stratigraafia.jpg',
          sm: 6,
          md: 4,
          lg: 4,
        },
        // Divider
        maardlad: {
          title: 'maardlad.title',
          description: 'maardlad.description',
          href: 'https://geoportaal.maaamet.ee/est/Ruumiandmed/Geoloogilised-andmed-p115.html',
          background: '/frontpage/maardlad.jpg',
          sm: 6,
          md: 4,
          lg: 4,
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
          md: 3,
          lg: 3,
        },
        ids: [
          'kirjandus',
          'doi',
          'geocollections',
          'fossiilid',
          'kivid',
          'sarv',
          'fond',
          'maardlad',
          'stratigraphy',
          'gmre',
          'turba',
          'geocase',
          'eurocore',
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
    }
  },
  head() {
    return {
      title: this.$t('landing.title'),
    }
  },
  computed: {
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
  },
}
</script>

<style lang="scss" scoped>
.spacer {
  aspect-ratio: 960/540;
  width: 100%;
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;
}

.layer1 {
  background-image: url('~/static/frontpage/layered-waves-haikei.svg');
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
