<template>
  <v-navigation-drawer
    :value="drawer"
    app
    clipped
    right
    temporary
    color="white"
    class="elevation-2"
    :style="`z-index: 2050; margin-top: ${$vuetify.application.top}px`"
    :class="{ 'use-padding-bottom': $vuetify.breakpoint.smAndDown }"
    @input="$emit('update:navigationDrawer', $event)"
  >
    <v-container class="more-menu py-4 mb-6">
      <!-- <div class="section-title montserrat pl-2">
        {{ $t('common.home') }}
      </div>

      <hr /> -->

      <v-list class="py-1 px-2">
        <v-list-item
          v-for="route in routes"
          :key="route.name"
          nuxt
          class="header-menu-item rounded my-1"
          color="accent darken-1"
          :to="localePath({ name: route.routeName })"
        >
          <v-list-item-title class="d-flex py-1">
            <v-icon class="mr-1">{{ route.icon }}</v-icon>
            <span class="align-self-center montserrat">{{
              $t(route.text)
            }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- <div class="d-flex flex-column align-start pl-2">
        <nuxt-link
          v-for="route in routes"
          :key="route.name"
          exact
          :to="localePath({ name: route.routeName })"
          class="mb-1 menu-link"
          active-class="menu-link-active"
          ><v-icon v-if="route.icon" small left>{{ route.icon }}</v-icon>
          {{ $t(route.text) }}
        </nuxt-link>
      </div> -->
      <div class="montserrat font-weight-medium pl-2 mt-2">
        {{ $t('landing.searchRoutes') }}
      </div>

      <v-divider class="primary" />

      <v-list class="py-1 px-2">
        <v-list-item
          v-for="route in searchRoutes"
          :key="route.name"
          nuxt
          class="header-menu-item rounded my-1"
          color="accent darken-1"
          :to="localePath({ name: route.routeName })"
        >
          <v-list-item-title class="d-flex py-1"
            ><v-icon v-if="route.icon">{{ route.icon }}</v-icon>
            <v-icon v-else style="height: 24px; width: 24px"></v-icon>

            <span class="ml-3 align-self-center montserrat">{{
              $t(route.text)
            }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <!-- <div class="d-flex flex-column align-start pl-2">
        <nuxt-link
          v-for="route in searchRoutes"
          :key="route.name"
          exact
          :to="localePath({ name: route.routeName })"
          class="mb-1 menu-link"
          active-class="menu-link-active"
          ><v-icon v-if="route.icon" small left>{{ route.icon }}</v-icon>
          {{ $t(route.text) }}
        </nuxt-link>
      </div> -->

      <!-- <div class="section-title montserrat pl-2">
        {{ $t('common.links') }}
      </div>

      <hr />

      <div class="d-flex flex-column align-start pl-2">
        <a
          v-for="link in links"
          :key="link.name"
          :href="link.url"
          class="mb-1 menu-link"
        >
          <v-icon v-if="link.icon" small left>{{ link.icon }}</v-icon>
          {{ $t(link.name) }}
        </a>
      </div>

      <div class="section-title montserrat pl-2">
        {{ $t('common.institutions') }}
      </div>

      <hr />

      <div class="d-flex flex-column align-start pl-2">
        <a
          v-for="item in institutions"
          :key="item.name"
          :href="item.url"
          class="mb-1 menu-link"
        >
          <v-icon v-if="item.icon" small left>{{ item.icon }}</v-icon>
          {{ $t(item.name) }}
        </a>
      </div> -->

      <div class="montserrat font-weight-medium pl-2 mt-2">
        {{ $t('common.lang') }}
      </div>

      <v-divider class="primary" />

      <language-list class="py-0" />
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import LanguageList from '~/components/language/LanguageList'
export default {
  name: 'NavigationDrawer',
  components: { LanguageList },
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
        {
          routeName: 'dataset',
          text: 'dataset.pageTitle',
          icon: 'mdi-database-outline',
        },
        {
          routeName: 'taxon',
          text: 'taxon.pageTitle',
          icon: 'mdi-family-tree',
        },
        // {
        //   name: 'file',
        //   lang: 'attachments',
        //   icon: 'mdi-folder-open-outline',
        // },
        {
          routeName: 'stratigraphy',
          text: 'stratigraphy.pageTitle',
          icon: 'mdi-layers-triple',
        },
        {
          routeName: 'photo',
          text: 'photo.pageTitle',
          icon: 'mdi-file-image-outline',
        },
        {
          routeName: 'specimen',
          text: 'specimen.pageTitle',
          icon: 'mdi-microscope',
        },
        { routeName: 'preparation', text: 'preparation.pageTitle' },
        { routeName: 'area', text: 'area.pageTitle' },
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
    }
  },
}
</script>

<style scoped>
.more-menu .section-title {
  font-size: 13px;
  font-weight: 500;
  /* letter-spacing: 1.5px; */
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

.v-list-item::before {
  border-radius: 4px;
}
</style>
