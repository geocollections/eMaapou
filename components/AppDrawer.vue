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
        <base-menu-list-item
          v-for="(item, index) in browseGeography"
          :key="`browse-geography-item-${index}`"
          class="my-1"
          :icon="item.icon"
          :label="$t(item.label)"
          nuxt
          trailing-icon=""
          :to="localePath({ name: item.routeName })"
        />
      </v-list>
      <v-divider class="mx-3 my-1" />
      <v-list class="py-1 px-2">
        <base-menu-list-item
          v-for="(item, index) in browseLab"
          :key="`browse-geography-item-${index}`"
          class="my-1"
          :icon="item.icon"
          :label="$t(item.label)"
          nuxt
          trailing-icon=""
          :to="localePath({ name: item.routeName })"
        />
      </v-list>

      <v-divider class="mx-3 my-1" />
      <v-list class="py-1 px-2">
        <base-menu-list-item
          v-for="(item, index) in browseTaxon"
          :key="`browse-geography-item-${index}`"
          class="my-1"
          :icon="item.icon"
          :label="$t(item.label)"
          nuxt
          trailing-icon=""
          :to="localePath({ name: item.routeName })"
        />
      </v-list>

      <v-divider class="mx-3 my-1" />
      <v-list class="py-1 px-2">
        <base-menu-list-item
          class="my-1"
          icon="mdi-file-image-outline"
          :label="$t('photo.pageTitle')"
          nuxt
          trailing-icon=""
          :to="localePath({ name: 'photo' })"
        />
      </v-list>

      <div class="montserrat font-weight-medium pl-2 mt-2">Services</div>

      <v-divider class="primary" />

      <v-list class="py-1 px-2">
        <v-list-item
          v-for="tabId in externalCards.ids"
          :key="externalCards[tabId].href"
          tag="a"
          class="header-menu-item rounded my-1"
          color="accent darken-1"
          target="_blank"
          :href="externalCards[tabId].href"
        >
          <v-list-item-title class="py-1">
            <span class="montserrat">{{ $t(externalCards[tabId].title) }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <div class="montserrat font-weight-medium pl-2 mt-2">
        {{ $t('common.lang') }}
      </div>

      <v-divider class="primary" />

      <language-list class="py-0" />
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import LanguageList from '~/components/language/LanguageList.vue'
import BaseMenuListItem from '~/components/base/BaseMenuListItem.vue'
import {
  BROWSE_GEOLOGY_LIST,
  BROWSE_LAB_LIST,
  BROWSE_TAXON_LIST,
  SERVICES,
} from '~/constants'
export default {
  name: 'AppDrawer',
  components: { LanguageList, BaseMenuListItem },
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      browseGeography: BROWSE_GEOLOGY_LIST,
      browseLab: BROWSE_LAB_LIST,
      browseTaxon: BROWSE_TAXON_LIST,
      services: SERVICES,
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
      externalCards: {
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
        // Divider
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
        // Divider
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
