<template>
  <v-footer padless class="mt-4">
    <v-card width="100%" flat tile color="tertiary">
      <div
        v-if="$vuetify.breakpoint.smAndUp"
        class="d-flex mx-auto"
        style="max-width: 700px; max-height: 700px"
      >
        <v-card-text>
          <div class="section-title font-weight-bold mb-1">
            {{ $t('common.home') }}
            <hr />
          </div>

          <div v-for="link in routes" :key="link.routeName" class="d-flex mb-1">
            <v-icon color="white" x-small>mdi-chevron-right</v-icon>
            <nuxt-link
              :to="localePath(link.routeName)"
              class="text-link-footer d-block ml-1"
              style="font-weight: 500 !important"
            >
              {{ $t(link.text) }}
            </nuxt-link>
          </div>
          <div class="section-title font-weight-bold mb-1 mt-4">
            {{ $t('landing.searchRoutes') }}
            <hr />
          </div>

          <div
            v-for="link in searchRoutes"
            :key="link.routeName"
            class="d-flex mb-1"
          >
            <v-icon color="white" x-small>mdi-chevron-right</v-icon>
            <nuxt-link
              :to="localePath(link.routeName)"
              class="text-link-footer d-block ml-1"
              style="font-weight: 500 !important"
            >
              {{ $t(link.text) }}
            </nuxt-link>
          </div>
        </v-card-text>

        <v-card-text>
          <div class="section-title font-weight-bold mb-1">
            {{ $t('common.links') }}
            <hr />
          </div>

          <div style="column-count: 2">
            <div v-for="link in links" :key="link.name" class="d-flex mb-1">
              <v-icon color="white" x-small>mdi-chevron-right</v-icon>
              <a
                :href="link.url"
                class="text-link-footer d-block ml-1"
                style="font-weight: 500 !important"
              >
                {{ $t(link.name) }}
              </a>
            </div>
          </div>
          <div class="section-title font-weight-bold mb-1 mt-4">
            {{ $t('common.institutions') }}
            <hr />
          </div>

          <div
            v-for="link in institutions"
            :key="link.name"
            class="d-flex mb-1"
          >
            <v-icon color="white" x-small>mdi-chevron-right</v-icon>
            <a
              :href="link.url"
              class="text-link-footer d-block ml-1"
              style="font-weight: 500 !important"
            >
              {{ $t(link.name) }}
            </a>
          </div>
        </v-card-text>
      </div>
      <v-card-text class="text-center">
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
      </v-card-text>
      <!--      <v-card-text class="text-center">
        {{ $t('footerPreliminary') }}
      </v-card-text>-->
      <v-card-text class="text-center mx-auto" style="max-width: 700px">
        <i18n path="footer" tag="div">
          <a
            v-for="(item, index) in textLinks"
            :key="index"
            :href="item.href"
            class="text-link"
            target="FooterLink"
            >{{ item.text }}</a
          >
        </i18n>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
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
