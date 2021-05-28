<template>
  <v-navigation-drawer
    :value="drawer"
    app
    right
    temporary
    width="100%"
    color="quaternary"
    class="elevation-4"
    :height="$vuetify.breakpoint.smAndUp ? 'unset' : `100%`"
    :style="`z-index: 2050; margin-top: ${$vuetify.application.top}px; opacity: 0.95`"
    :class="{ 'use-padding-bottom': $vuetify.breakpoint.smAndDown }"
    @input="$emit('update:navigationDrawer', $event)"
  >
    <v-container class="more-menu py-4 mb-6">
      <v-row>
        <v-col cols="12" sm="4" class="px-4 py-0">
          <div class="section-title">
            {{ $t('landing.routes') }}
          </div>

          <hr />

          <div class="d-flex flex-column align-start">
            <nuxt-link
              v-for="item in routes"
              :key="item.name"
              exact
              :to="localePath({ name: item.name })"
              class="mb-1 menu-link"
              active-class="menu-link-active"
              ><v-icon v-if="item.icon" small left>{{ item.icon }}</v-icon>
              {{ $t(`common.${item.lang}`) }}
            </nuxt-link>
          </div>
          <div class="section-title">
            {{ $t('landing.searchRoutes') }}
          </div>

          <hr />

          <div class="d-flex flex-column align-start">
            <nuxt-link
              v-for="item in searchRoutes"
              :key="item.name"
              exact
              :to="localePath({ name: item.name })"
              class="mb-1 menu-link"
              active-class="menu-link-active"
              ><v-icon v-if="item.icon" small left>{{ item.icon }}</v-icon>
              {{ $t(`common.${item.lang}`) }}
            </nuxt-link>
          </div>
        </v-col>

        <v-col cols="12" sm="4" class="px-4 py-0">
          <div class="section-title">{{ $t('common.links') }}</div>

          <hr />

          <div class="d-flex flex-column align-start">
            <a
              v-for="item in links"
              :key="item.name"
              :href="item.url"
              class="mb-1 menu-link"
            >
              <v-icon v-if="item.icon" small left>{{ item.icon }}</v-icon>
              {{ $t(item.name) }}
            </a>
          </div>
        </v-col>

        <v-col cols="12" sm="4" class="px-4 py-0">
          <div class="section-title">{{ $t('common.institutions') }}</div>

          <hr />

          <div class="d-flex flex-column align-start">
            <a
              v-for="item in institutions"
              :key="item.name"
              :href="item.url"
              class="mb-1 menu-link"
            >
              <v-icon v-if="item.icon" small left>{{ item.icon }}</v-icon>
              {{ $t(item.name) }}
            </a>
          </div>

          <div class="section-title">{{ $t('common.lang') }}</div>

          <hr />

          <lang-list class="py-0" />
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import LangList from '~/components/lang_switcher/LangList'
export default {
  name: 'NavigationDrawer',
  components: { LangList },
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      routes: [
        {
          name: 'search',
          lang: 'search',
          icon: 'mdi-magnify',
        },
        {
          name: 'about',
          lang: 'about',
          icon: 'mdi-information-outline',
        },
      ],
      searchRoutes: [
        {
          name: 'locality',
          lang: 'localities',
          icon: 'mdi-map-marker-outline',
        },
        {
          name: 'site',
          lang: 'sites',
          icon: 'mdi-binoculars',
        },
        {
          name: 'drillcore',
          lang: 'drillcores',
          icon: 'mdi-screw-machine-flat-top',
        },
        {
          name: 'sample',
          lang: 'samples',
          icon: 'mdi-test-tube',
        },
        {
          name: 'analysis',
          lang: 'analyses',
          icon: 'mdi-chart-scatter-plot',
        },
        {
          name: 'analytical_data',
          lang: 'analyticalData',
          icon: 'mdi-chart-scatter-plot',
        },
        {
          name: 'dataset',
          lang: 'datasets',
          icon: 'mdi-screw-machine-flat-top',
        },
        {
          name: 'taxon',
          lang: 'taxa',
          icon: 'mdi-layers-triple',
        },
        // {
        //   name: 'file',
        //   lang: 'attachments',
        //   icon: 'mdi-folder-open-outline',
        // },
        {
          name: 'stratigraphy',
          lang: 'stratigraphy',
          icon: 'mdi-layers-triple',
        },
        { name: 'photo', lang: 'photo', icon: 'mdi-file-image-outline' },
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
          url:
            'https://geoportaal.maaamet.ee/est/Ruumiandmed/Geoloogilised-andmed-p115.html',
        },
        { name: 'doi.title', url: 'https://doi.geocollections.info' },
        { name: 'turba.title', url: 'https://turba.geoloogia.info' },
        { name: 'geocase.title', url: 'https://geocase.eu' },
        { name: 'eurocore.title', url: 'eurocore.description' },
        { name: 'sarv.title', url: 'https://edit.geocollections.info' },
        { name: 'link.sarvAPI', url: 'https://api.geocollections.info' },
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
          url:
            'https://geoportaal.maaamet.ee/est/Ruumiandmed/Geoloogilised-andmed-p115.html',
        },
        { name: 'institutions.egeos', url: 'https://egeos.ee' },
        { name: 'institutions.maeselts', url: 'http://maeselts.ee' },
        { name: 'institutions.steiger', url: 'https://steiger.ee' },
      ],
    }
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales
    },
  },
}
</script>

<style scoped>
.more-menu .section-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-top: 24px;
  text-transform: uppercase;
}
.more-menu hr {
  border: 0;
  border-top: 2px solid #959595;
  margin: 16px 0;
  opacity: 0.2;
}

.use-padding-bottom {
  padding-bottom: 56px;
}

.lang-icon {
  height: 20px;
  width: 20px !important;
}

.flag {
  position: relative;
  display: inline-block;
  width: 1em;
  line-height: 1em;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  border-radius: 100%;
}

.flag:before {
  content: '\A0';
}

.flag-et {
  background-image: url('~assets/et.svg');
}

.flag-en {
  background-image: url('~assets/en.svg');
}
</style>
