<template>
  <v-footer padless color="tertiary">
    <v-container :fluid="$vuetify.breakpoint.lgAndDown">
      <v-row no-gutters>
        <v-col cols="12" lg="auto">
          <div class="d-md-flex justify-center">
            <!-- <div class="montserrat white--text mx-3 mr-8 mb-6">
              <img
                style="height: 50px; width: 100px"
                :src="$img(logo, null, { provider: 'static' })"
              />
              <div class="font-weight-medium" style="white-space: nowrap">
                {{ $t('subtitle') }}
              </div>
            </div> -->
            <div class="ml-4 ml-md-0 mr-4 mb-6">
              <!-- <div
                class="
                  section-title
                  white--text
                  font-weight-medium
                  montserrat
                  mb-4
                "
              >
                {{ $t('common.home') }}
              </div> -->
              <img
                style="height: 24px; margin-bottom: 10px"
                :src="$img(logo, null, { provider: 'static' })"
              />
              <div
                v-for="link in routes"
                :key="link.routeName"
                class="d-flex mb-1"
              >
                <v-icon color="white" x-small>mdi-chevron-right</v-icon>
                <nuxt-link
                  :to="localePath(link.routeName)"
                  class="text-link text-body-2 grey--text text--lighten-2 d-block ml-1"
                  style="font-weight: 500 !important"
                >
                  {{ $t(link.text) }}
                </nuxt-link>
              </div>
            </div>
            <div class="mx-4 mb-6">
              <div
                class="section-title white--text font-weight-medium montserrat mb-4"
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
                    class="text-link text-body-2 grey--text text--lighten-2 d-block ml-1"
                    style="font-weight: 500 !important"
                  >
                    {{ $t(link.text) }}
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div class="ml-3 mb-6">
              <div
                class="section-title white--text font-weight-medium montserrat mb-4"
              >
                {{ $t('common.links') }}
              </div>

              <div class="d-sm-inline-block" style="column-count: 2">
                <div v-for="link in links" :key="link.name" class="d-flex mb-1">
                  <v-icon color="white" x-small>mdi-chevron-right</v-icon>
                  <a
                    :href="link.url"
                    class="text-link text-body-2 grey--text text--lighten-2 d-block ml-1"
                    style="font-weight: 500 !important"
                  >
                    {{ $t(link.name) }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </v-col>
        <v-col>
          <div class="ml-3 mb-6">
            <div
              class="section-title white--text font-weight-medium montserrat mb-4"
            >
              {{ $t('common.partners') }}
            </div>
            <div>
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
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid style="background: #282828 !important">
      <v-container :fluid="$vuetify.breakpoint.lgAndDown">
        <v-row no-gutters>
          <v-col cols="12" align-self="center">
            <div class="text-center d-flex justify-center align-center">
              <div style="max-width: 700px">
                <i18n
                  class="text-body-2 grey--text text--lighten-1"
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
          <v-col cols="12" align-self="center" class="text-center mt-3">
            <a href="https://github.com/geocollections/eMaapou">
              <nuxt-img
                src="/logos/GitHub-Mark-Light-64px.png"
                alt="GitHub"
                provider="static"
                class="github-logo py-1 py-sm-0 px-3"
              />
            </a>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-footer>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
export default {
  name: 'AppFooter',
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
        { name: 'link.geologyAPI', url: 'https://api.geoloogia.info' },
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

<style scoped lang="scss">
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
  height: 60px;
  width: auto;
  /*padding: 0 10px;*/
}

.github-logo {
  height: 32px;
  width: auto;
  /*padding: 0 10px;*/
}

.hall {
  background-color: #5c6598 !important;
  border-color: #5c6598 !important;
}
</style>
