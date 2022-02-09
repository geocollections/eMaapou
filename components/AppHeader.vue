<template>
  <v-app-bar
    app
    dark
    clipped-right
    absolute
    height="56"
    extension-height="40"
    :elevation="0"
    class="gradient-background"
    style="z-index: 2060"
  >
    <v-app-bar-title class="align-self-center">
      <!--
          NOTE: Tooltip is implemented with activator prop so that it does not disappear before chaning routes.
          Using v-slot:activator added a transition that made the title disappear when clicked.
          https://github.com/vuetifyjs/vuetify/issues/10578 comment by eduardo76 Nov 9, 2020
         -->
      <nuxt-link id="app-bar-title" :to="localePath({ path: '/' })">
        <v-img
          v-if="$vuetify.breakpoint.mdAndUp"
          :height="40"
          :width="80"
          contain
          :src="$img(logo, null, { provider: 'static' })"
        />
        <v-img
          v-else
          :height="32"
          :width="32"
          contain
          :src="$img(logoCompact, null, { provider: 'static' })"
        />
        <v-tooltip bottom activator="#app-bar-title">
          <span>{{ $t('landing.goToFrontpage') }}</span>
        </v-tooltip>
      </nuxt-link>

      <!-- <v-icon color="white" size="80">$logo</v-icon> -->
    </v-app-bar-title>
    <!-- <v-divider
      v-show="$vuetify.breakpoint.lgAndUp"
      vertical
      inset
      class="mx-3 white"
    /> -->
    <!-- <div v-show="$vuetify.breakpoint.lgAndUp" class="montserrat">
      {{ $t('slogan') }}
    </div> -->

    <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp" class="ml-10">
      <v-menu
        content-class="elevation-2 mt-1"
        transition="slide-y-transition"
        offset-y
        bottom
        right
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            aria-label="browse"
            text
            class="montserrat"
            style="text-transform: capitalize"
            v-on="on"
          >
            Browse
            <v-icon class="ml-1" small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-card width="550">
          <v-card-actions class="d-block">
            <div
              v-for="(tab, index) in tabsAll"
              :key="`browse-${index}`"
              class="d-inline-block"
            >
              <v-hover v-slot="{ hover }">
                <v-card
                  elevation="0"
                  nuxt
                  class="align-center ma-1 px-2 py-3"
                  :class="{ 'on-hover': hover }"
                  active-class="active-card"
                  width="250"
                  :to="localePath({ name: tab.routeName })"
                >
                  <div
                    class="
                      font-weight-medium
                      text-button
                      d-flex
                      ml-2
                      align-center
                    "
                    style="text-transform: capitalize !important"
                  >
                    <v-icon v-if="tab.icon">{{ tab.icon }}</v-icon>
                    <v-icon v-else style="height: 24px; width: 24px"></v-icon>
                    <div class="ml-3 montserrat tab" style="">
                      {{ $t(tab.text) }}
                    </div>
                    <v-icon v-show="hover" class="ml-auto mr-2">
                      mdi-arrow-right
                    </v-icon>
                  </div>
                </v-card>
              </v-hover>
            </div>
          </v-card-actions>
        </v-card>
      </v-menu>

      <v-btn
        nuxt
        aria-label="about page"
        text
        class="montserrat"
        style="text-transform: capitalize"
        :to="localePath({ name: 'about' })"
      >
        {{ $t('common.about') }}
      </v-btn>

      <v-btn
        nuxt
        aria-label="news page"
        text
        class="montserrat"
        style="text-transform: capitalize"
        :to="localePath({ name: 'news' })"
      >
        {{ $t('common.news') }}
      </v-btn>
    </v-toolbar-items>
    <v-spacer v-if="$vuetify.breakpoint.mdAndUp" />
    <v-toolbar-items
      class="align-center"
      :style="{ width: !$vuetify.breakpoint.mdAndUp ? '100%' : 'inherit' }"
    >
      <div
        class="d-flex elevation-1 rounded mr-2"
        :class="{ 'mobile-search mx-5': !$vuetify.breakpoint.mdAndUp }"
      >
        <query-search-field
          v-model="query"
          class="rounded-r-0 montserrat"
          background-color="grey lighten-5"
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
            :color="hover ? 'warning' : 'grey lighten-5'"
            class="rounded-l-0"
            @click="$router.push(localePath({ name: 'search' }))"
          >
            <v-icon color="accent darken-2">mdi-magnify</v-icon>
          </v-btn>
        </v-hover>
      </div>
      <lang-switcher v-if="$vuetify.breakpoint.mdAndUp" />
      <v-btn
        v-if="!$vuetify.breakpoint.mdAndUp"
        text
        class="montserrat"
        aria-label="Open navigation drawer"
        style="text-transform: capitalize"
        @click.stop="$emit('toggle:navigationDrawer')"
      >
        <v-icon size="font-size: 24px">mdi-menu</v-icon>
      </v-btn>
    </v-toolbar-items>

    <!-- <template #extension>
      <v-tabs
        :value="tabValue"
        align-with-title
        optional
        show-arrows
        center-active
        light
        centered
      >
        <v-tab
          v-for="(tab, index) in tabs"
          :key="index"
          nuxt
          active-class="active-tab"
          :to="localePath({ name: tab.routeName })"
          class="tab montserrat font-weight-medium text-capitalize"
          style="font-size: 0.875rem !important"
        >
          {{ $t(tab.text) }}
        </v-tab>
        <v-menu
          transition="slide-y-transition"
          offset-y
          bottom
          elevation="2"
          content-class="elevation-2 rounded-t-0"
        >
          <template #activator="{ on }">
            <v-btn
              tile
              height="auto"
              elevation="0"
              color="transparent"
              class="px-0"
              v-on="on"
            >
              <v-icon color="grey darken-3">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list class="py-0 dots-vertical-list" dense>
            <v-list-item
              v-for="(tab, index) in hiddenTabs"
              :key="`hidden-tab-${index}`"
              class="tab montserrat font-weight-medium text-capitalize"
              style="font-size: 0.875rem"
              active-class="active-tab"
              nuxt
              :to="localePath({ name: tab.routeName })"
            >
              <v-list-item-content class="justify-center">
                {{ $t(tab.text) }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-tabs>
    </template> -->
  </v-app-bar>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

import QuerySearchField from './fields/QuerySearchField.vue'
import LangSwitcher from '~/components/lang-switcher/LangSwitcher.vue'
export default {
  name: 'AppHeader',
  components: { LangSwitcher, QuerySearchField },
  props: {
    drawer: Boolean,
  },
  data() {
    return {
      tabs: [
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
        },
        {
          routeName: 'sample',
          text: 'sample.pageTitle',
        },
        {
          routeName: 'analytical-data',
          text: 'analyticalData.pageTitle',
        },
        { routeName: 'dataset', text: 'dataset.pageTitle' },
        { routeName: 'photo', text: 'photo.pageTitle' },
      ],
      hiddenTabs: [
        {
          routeName: 'specimen',
          text: 'specimen.pageTitle',
        },
        {
          routeName: 'preparation',
          text: 'preparation.pageTitle',
        },
        {
          routeName: 'area',
          text: 'area.pageTitle',
        },
        {
          routeName: 'analysis',
          text: 'analysis.pageTitle',
        },
        {
          routeName: 'taxon',
          text: 'taxon.pageTitle',
        },
        {
          routeName: 'stratigraphy',
          text: 'stratigraphy.pageTitle',
        },
      ],
      tabsAll: [
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
      logo: '/logos/emaapou5white.svg',
      logoCompact: '/logos/emaapou_short.svg',
    }
  },
  computed: {
    ...mapFields('search', ['query']),
    tabValue() {
      // https://github.com/vuetifyjs/vuetify/issues/12265
      const path = this.$route.path
      const full = this.$route.fullPath
      return path[path.length - 1] !== '/'
        ? `${path}/${full.substring(path.length)}`
        : `${full}/`
    },
  },
}
</script>

<style scoped lang="scss">
.tab {
  color: #424242 !important;
}

.mobile-search {
  width: 100%;
}

.active-tab {
  color: var(--v-accent-darken1) !important;
  font-weight: 600 !important;
}

.v-app-bar ::v-deep .v-toolbar__content {
  padding-right: 0;
  padding-left: 0;
  padding-top: 0;
  padding-bottom: 0;
  max-width: 1785px;
  margin-left: auto;
  margin-right: auto;
  // padding-right: 20px;
  padding-left: 20px;
}

.v-app-bar ::v-deep .v-toolbar__extension {
  background-color: #f7f6f4;
  border-bottom: lightgray solid 1px;
}

#quick-search-btn {
  min-width: 0 !important;
}

.active-card {
  background-color: rgba(9, 98, 124, 0.12) !important;

  & div {
    color: var(--v-accent-darken1) !important;
  }

  & .v-icon {
    color: var(--v-accent-darken1) !important;
  }
}

$gradient-col: var(--v-primary-base);
$gradient-col-sec: var(--v-header-darken1);

.gradient-background {
  background: linear-gradient(
    320deg,
    $gradient-col,
    $gradient-col-sec
  ) !important;
}

/* Overwrites vuetify list item color (https://github.com/vuetifyjs/vuetify/issues/9285) */
.dots-vertical-list
  > .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: #424242 !important;
}
</style>
