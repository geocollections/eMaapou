<template>
  <v-footer padless color="tertiary">
    <v-container :fluid="$vuetify.breakpoint.lgAndDown">
      <v-row no-gutters>
        <v-col cols="12">
          <div
            class="d-flex flex-row align-center text-h6 white--text mx-3 mb-6"
          >
            <img
              v-if="$vuetify.breakpoint.smAndUp"
              style="height: 50px; width: 100px"
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
        <v-col cols="12" lg="auto">
          <div class="d-md-flex">
            <div class="mx-3 mb-6">
              <div
                class="
                  section-title
                  white--text
                  font-weight-bold
                  montserrat
                  mb-4
                "
              >
                {{ $t('common.home') }}
              </div>

              <div
                v-for="link in routes"
                :key="link.routeName"
                class="d-flex mb-1"
              >
                <v-icon color="white" x-small>mdi-chevron-right</v-icon>
                <nuxt-link
                  :to="localePath(link.routeName)"
                  class="
                    text-link text-body-2
                    grey--text
                    text--lighten-2
                    d-block
                    ml-1
                  "
                  style="font-weight: 500 !important"
                >
                  {{ $t(link.text) }}
                </nuxt-link>
              </div>
            </div>
            <div class="mx-3 mb-6">
              <div
                class="
                  section-title
                  white--text
                  font-weight-bold
                  montserrat
                  mb-4
                "
              >
                {{ $t('landing.searchRoutes') }}
              </div>

              <div class="d-sm-inline-block" style="column-count: 2">
                <div
                  v-for="link in searchRoutes"
                  :key="link.routeName"
                  class="d-flex mb-1"
                >
                  <v-icon color="white" x-small>mdi-chevron-right</v-icon>
                  <nuxt-link
                    :to="localePath(link.routeName)"
                    class="
                      text-link text-body-2
                      grey--text
                      text--lighten-2
                      d-block
                      ml-1
                    "
                    style="font-weight: 500 !important"
                  >
                    {{ $t(link.text) }}
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div class="mx-3 mb-6">
              <div
                class="
                  section-title
                  white--text
                  font-weight-bold
                  montserrat
                  mb-4
                "
              >
                {{ $t('common.links') }}
              </div>

              <div class="d-sm-inline-block" style="column-count: 2">
                <div v-for="link in links" :key="link.name" class="d-flex mb-1">
                  <v-icon color="white" x-small>mdi-chevron-right</v-icon>
                  <a
                    :href="link.url"
                    class="
                      text-link text-body-2
                      grey--text
                      text--lighten-2
                      d-block
                      ml-1
                    "
                    style="font-weight: 500 !important"
                  >
                    {{ $t(link.name) }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" lg="" align-self="center">
          <!-- <div class="mb-4 mx-4">
            <div
              class="section-title white--text font-weight-bold montserrat mb-4"
            >
              {{ $t('common.search') }}
            </div>
            <div class="d-flex elevation-0 rounded" style="max-width: 400px">
              <input-search
                v-model="query"
                class="rounded-r-0 montserrat"
                background-color="grey lighten-4"
                dense
                flat
                :autofocus="false"
                :placeholder="$t('common.search')"
                @enter="$router.push(localePath({ name: 'search' }))"
              />
              <v-hover v-slot="{ hover }">
                <v-btn
                  id="quick-search-btn"
                  height="38"
                  width="48"
                  elevation="0"
                  :color="hover ? 'warning' : 'grey lighten-4'"
                  class="rounded-l-0"
                  @click="$router.push(localePath({ name: 'search' }))"
                >
                  <v-icon color="accent darken-2">mdi-magnify</v-icon>
                </v-btn>
              </v-hover>
            </div>
          </div>
          <v-divider style="border-color: lightgrey" /> -->
          <div class="text-center d-flex justify-center align-center">
            <div style="max-width: 700px">
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
              <!--      <v-card-text class="text-center">
        {{ $t('footerPreliminary') }}
      </v-card-text>-->
              <i18n
                class="mt-2 text-body-2 grey--text text--lighten-1"
                path="footer"
                tag="div"
              >
                <a
                  v-for="(item, index) in textLinks"
                  :key="index"
                  :href="item.href"
                  class="text-link font-weight-bold grey--text text--lighten-2"
                  target="FooterLink"
                  >{{ item.text }}</a
                >
              </i18n>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
// import InputSearch from './input/InputSearch.vue'
export default {
  name: 'AppFooter',
  // components: { InputSearch },
  data() {
    return {
      logo: '/logos/emaapou5white.svg',
      imageLinks: [
        {
          href: 'https://geocollections.info',
          src: '/logos/sarv_logo1b.svg',
          title: 'footerLinks.sarv',
          alt: 'footerLinks.sarv',
        },
        {
          href: 'https://natarc.ut.ee',
          src: '/logos/natarclogovalge1.png',
          title: 'footerLinks.natarc',
          alt: 'footerLinks.natarc',
        },
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
      textLinks: [
        {
          href: 'https://creativecommons.org/licenses/by-sa/3.0/',
          text: 'CC BY-SA',
        },
        {
          href: 'https://natarc.ut.ee/',
          text: 'NATARC',
        },
        {
          href: 'https://geocollections.info/',
          text: 'SARV',
        },
        {
          href: 'https://taltech.ee/geoloogia-instituut',
          text: 'TalTech',
        },
        {
          href: 'https://nuxtjs.org/',
          text: 'Nuxt.js',
        },
        {
          href: 'https://github.com/geocollections/EMA',
          text: 'GitHub',
        },
      ],
      links: [
        { name: 'geocollections.title', url: 'https://geocollections.info' },
        { name: 'kirjandus.title', url: 'https://kirjandus.geoloogia.info' },
        { name: 'gmre.title', url: 'https://geoloogia.info/geology' },
        { name: 'fond.title', url: 'https://fond.egt.ee' },
        { name: 'fossiilid.title', url: 'https://fossiilid.info' },
        { name: 'kivid.title', url: 'https://kivid.info' },
        { name: 'stratigraphy.title', url: 'http://stratigraafia.info' },
        {
          name: 'maardlad.title',
          url: 'https://geoportaal.maaamet.ee/est/Ruumiandmed/Geoloogilised-andmed-p115.html',
        },
        { name: 'doi.title', url: 'https://doi.geocollections.info' },
        { name: 'turba.title', url: 'https://turba.geoloogia.info' },
        { name: 'geocase.title', url: 'https://geocase.eu' },
        { name: 'eurocore.title', url: 'eurocore.description' },
        { name: 'sarv.title', url: 'https://edit.geocollections.info' },
        { name: 'link.sarvAPI', url: 'https://api.geocollections.info' },
        { name: 'link.geologyAPI', url: 'https://api.geoloogia.info' },
        { name: 'link.github', url: 'https://github.com/geocollections/' },
      ],
      institutions: [
        {
          name: 'institutions.ttu',
          url: 'https://taltech.ee/geoloogia-instituut',
        },
        { name: 'institutions.tu', url: 'https://geoloogia.ut.ee' },
        { name: 'institutions.egt', url: 'https://egt.ee' },
        {
          name: 'institutions.maaamet',
          url: 'https://geoportaal.maaamet.ee/est/Ruumiandmed/Geoloogilised-andmed-p115.html',
        },
        { name: 'institutions.egeos', url: 'https://egeos.ee' },
        { name: 'institutions.maeselts', url: 'http://maeselts.ee' },
        { name: 'institutions.steiger', url: 'https://steiger.ee' },
      ],
      searchRoutes: [
        {
          routeName: 'locality',
          text: 'locality.pageTitle',
        },
        {
          routeName: 'site',
          text: 'site.pageTitle',
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
        },
        {
          routeName: 'analytical-data',
          text: 'analyticalData.pageTitle',
        },
        {
          routeName: 'dataset',
          text: 'dataset.pageTitle',
        },
        {
          routeName: 'taxon',
          text: 'taxon.pageTitle',
        },
        // {
        //   name: 'file',
        //   lang: 'attachments',
        //   icon: 'mdi-folder-open-outline',
        // },
        {
          routeName: 'stratigraphy',
          text: 'stratigraphy.pageTitle',
        },
        {
          routeName: 'photo',
          text: 'photo.pageTitle',
        },
        {
          routeName: 'specimen',
          text: 'specimen.pageTitle',
        },
        { routeName: 'preparation', text: 'preparation.pageTitle' },
        { routeName: 'area', text: 'area.pageTitle' },
      ],
      routes: [
        {
          routeName: 'search',
          text: 'common.search',
          icon: 'mdi-magnify',
        },
        {
          routeName: 'about',
          text: 'common.about',
          icon: 'mdi-information-outline',
        },
        {
          routeName: 'news',
          text: 'common.news',
          icon: 'mdi-newspaper-variant-outline',
        },
      ],
    }
  },
  computed: {
    ...mapFields('search', ['query']),
  },
}
</script>

<style scoped>
.footer {
  -webkit-box-shadow: 0 -2px 4px -1px rgba(0, 0, 0, 0.2),
    0 -4px 5px 0 rgba(0, 0, 0, 0.14), 0 -1px 10px 0 rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0 -2px 4px -1px rgba(0, 0, 0, 0.2),
    0 -4px 5px 0 rgba(0, 0, 0, 0.14), 0 -1px 10px 0 rgba(0, 0, 0, 0.12) !important;
}

.v-card__text {
  font-size: 0.7em;
  font-weight: 400;
  color: white !important;
}

/* .v-card__text a:visited,
.v-card__text a:link,
.v-card__text a:active {
  color: white !important;
  font-weight: 600;
} */

.footer-logo {
  height: 50px;
  width: auto;
  /*padding: 0 10px;*/
}

.hall {
  background-color: #5c6598 !important;
  border-color: #5c6598 !important;
}
</style>
