<template>
  <div>
    <v-img
      :height="$vuetify.breakpoint.height < 800 ? 'unset' : '100vh'"
      :max-height="$vuetify.breakpoint.height < 800 ? 'none' : '100vh'"
      width="100%"
      class="elevation-4 background-image"
      position="center 20%"
      :src="$img('/frontpage/header_img.jpg', null, { provider: 'static' })"
      :lazy-src="
        $img('/frontpage/header_img_medium.jpg', null, { provider: 'static' })
      "
    >
      <div
        class="
          d-flex
          flex-column
          align-sm-content-start align-sm-content-center
          pb-10
        "
        style="height: 100%; margin-top: 64px"
      >
        <v-row no-gutters align-content="end" class="flex-grow-0">
          <v-col
            cols="10"
            sm="8"
            md="10"
            lg="12"
            offset-md="1"
            offset-sm="2"
            offset="1"
            class="mb-5"
          >
            <!-- TITLE -->
            <div
              class="
                d-flex
                flex-row
                align-center
                text-h4 text-md-h3 text-sm-h4
                white--text
              "
            >
              <img
                v-if="$vuetify.breakpoint.smAndUp"
                style="height: 100px; width: 200px"
                :src="$img(logo, null, { provider: 'static' })"
                class="mt-5 mb-sm-5 mr-4"
              />
              <v-divider
                v-if="$vuetify.breakpoint.smAndUp"
                vertical
                class="white my-5"
              />
              <div class="ml-sm-4 font-weight-medium">
                {{ $t('slogan') }}
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row
          no-gutters
          align-content="center"
          align-content-sm="start"
          justify="center"
          justify-sm="start"
          class="mt-6 mt-sm-2 flex-grow-0 flex-sm-grow-1"
        >
          <v-col cols="11" sm="8" :md="5" :lg="4" offset-md="1" offset-sm="2">
            <!-- MAIN CARD -->
            <the-search-card
              :show-map="showMap"
              :render-side-card="renderSideCard"
              @toggle:side="showMap = !showMap"
            />
            <!-- INSTITUTION ICONS -->
            <div v-if="!$vuetify.breakpoint.xsOnly" class="mt-4">
              <a
                v-for="(item, index) in imageLinks"
                :key="index"
                :href="item.href"
                target="FooterLink"
                rel="noopener noreferrer"
              >
                <v-tooltip top>
                  <template #activator="{ on, attrs }">
                    <nuxt-img
                      v-bind="attrs"
                      :src="item.src"
                      :alt="$t(item.alt)"
                      provider="static"
                      class="footer-logo py-1 py-sm-0 px-3"
                      v-on="on"
                    />
                  </template>

                  <span>{{ $t(item.title) }}</span>
                </v-tooltip>
              </a>
            </div>
          </v-col>
          <!-- SIDE CARD -->
          <v-slide-x-transition v-if="renderSideCard" mode="out-in">
            <v-col v-if="showMap" key="map" md="5" lg="6" class="pa-0">
              <the-map-card :show-map="showMap" />
            </v-col>
          </v-slide-x-transition>
        </v-row>
        <!-- SCROLL INDICATOR -->
        <v-fade-transition>
          <div
            v-if="scrollY === 0"
            class="d-flex justify-center"
            style="
              position: absolute;
              bottom: 0;
              width: 100%;
              pointer-events: none;
            "
          >
            <v-btn
              style="pointer-events: auto"
              :ripple="false"
              dark
              small
              plain
              icon
              class="pulse d-flex flex-column px-0"
              @click="$vuetify.goTo('#otherServices')"
              ><v-icon x-large>mdi-chevron-down</v-icon>
            </v-btn>
          </div>
        </v-fade-transition>
      </div>
    </v-img>
    <v-container :fluid="$vuetify.breakpoint.lgAndDown">
      <v-row class="my-2 my-sm-10" justify="center" align="center">
        <v-col id="otherServices" cols="12">
          <title-card :title="$t('landing.otherPages')" class="title-heading" />
        </v-col>
        <v-col>
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
      </v-row>
      <v-row justify="center" class="my-2 my-sm-10">
        <v-col cols="12" lg="6">
          <client-only>
            <the-news-card />
          </client-only>
        </v-col>
        <v-col cols="12" lg="6">
          <title-card :title="$t('about.title')" class="title-heading" />

          <div
            class="aboutpage px-2 px-sm-5"
            :style="{ 'column-count': aboutTextColumns }"
            v-html="$translate({ et: page.content_et, en: page.content_en })"
          ></div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { isEmpty } from 'lodash'
import ExternalLinkCard from '~/components/ExternalLinkCard.vue'
import TitleCard from '~/components/TitleCard.vue'
import TheNewsCard from '~/components/landing/TheNewsCard.vue'
import TheSearchCard from '~/components/landing/TheSearchCard.vue'
import TheMapCard from '~/components/landing/TheMapCard.vue'
export default {
  components: {
    ExternalLinkCard,
    TitleCard,
    TheNewsCard,
    TheSearchCard,
    TheMapCard,
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
.background-image ::v-deep > .v-image__image {
  filter: brightness(0.6) !important;
}

.quick-search-card {
  border-left-width: 5px !important;
  border-left-style: solid !important;
  border-left-color: var(--v-accent-base) !important;
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
</style>
