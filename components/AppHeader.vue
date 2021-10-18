<template>
  <v-app-bar
    app
    dark
    clipped-right
    absolute
    height="56"
    extension-height="40"
    :elevation="4"
    class="gradient-background"
    style="z-index: 2060"
  >
    <v-app-bar-title class="ml-3 align-self-center">
      <!--
          NOTE: Tooltip is implemented with activator prop so that it does not disappear before chaning routes.
          Using v-slot:activator added a transition that made the title disappear when clicked.
          https://github.com/vuetifyjs/vuetify/issues/10578 comment by eduardo76 Nov 9, 2020
         -->
      <nuxt-link id="app-bar-title" :to="localePath({ path: '/' })">
        <v-img
          :height="40"
          :width="80"
          contain
          :src="$img(logo, null, { provider: 'static' })"
        />
        <v-tooltip bottom activator="#app-bar-title">
          <span>{{ $t('landing.goToFrontpage') }}</span>
        </v-tooltip>
      </nuxt-link>
    </v-app-bar-title>
    <v-divider
      v-show="$vuetify.breakpoint.lgAndUp"
      vertical
      inset
      class="mx-3 white"
    />
    <div v-show="$vuetify.breakpoint.lgAndUp" class="montserrat">
      {{ $t('slogan') }}
    </div>

    <v-toolbar-items v-show="$vuetify.breakpoint.mdAndUp" class="ml-3">
      <v-btn
        nuxt
        aria-label="about page"
        text
        class="montserrat"
        :to="localePath({ name: 'about' })"
      >
        {{ $t('common.about') }}
      </v-btn>

      <v-btn
        nuxt
        aria-label="news page"
        text
        class="montserrat"
        :to="localePath({ name: 'news' })"
      >
        {{ $t('common.news') }}
      </v-btn>
    </v-toolbar-items>
    <v-spacer />
    <v-toolbar-items class="align-center">
      <div
        v-if="$vuetify.breakpoint.smAndUp"
        class="d-flex mr-2"
        style="width: 232px"
      >
        <query-search-field
          v-model="query"
          class="rounded-0 montserrat"
          background-color="grey lighten-5"
          dense
          :autofocus="false"
          :placeholder="$t('common.search')"
          @enter="$router.push(localePath({ name: 'search' }))"
        />
        <v-btn
          id="quick-search-btn"
          height="38"
          width="48"
          color="header"
          class="rounded-0"
          @click="$router.push(localePath({ name: 'search' }))"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>
      <lang-switcher />
      <v-btn
        text
        class="montserrat"
        aria-label="Open navigation drawer"
        @click.stop="$emit('toggle:navigationDrawer')"
      >
        <div v-if="drawer">
          <span
            v-show="$vuetify.breakpoint.smAndUp"
            style="vertical-align: middle"
            >{{ $t('common.close') }}</span
          ><v-icon size="font-size: 24px">mdi-close</v-icon>
        </div>
        <div v-else>
          <span
            v-show="$vuetify.breakpoint.smAndUp"
            style="vertical-align: middle"
            >{{ $t('common.more') }}</span
          >
          <v-icon size="font-size: 24px">mdi-menu</v-icon>
        </div>
      </v-btn>
    </v-toolbar-items>

    <template #extension>
      <v-tabs
        :value="tabValue"
        align-with-title
        class="header-tabs white"
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
          active-class="active-tab font-weight-bold"
          :to="localePath({ name: tab.routeName })"
          class="montserrat font-weight-bold"
        >
          {{ $t(tab.text) }}
        </v-tab>
        <v-menu tile transition="slide-y-transition" offset-y bottom>
          <template #activator="{ on }">
            <v-btn
              tile
              height="auto"
              elevation="0"
              color="transparent"
              class="px-0"
              v-on="on"
            >
              <v-icon color="primary">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list class="py-0 dots-vertical-list" dense>
            <v-list-item
              v-for="(tab, index) in hiddenTabs"
              :key="`hidden-tab-${index}`"
              class="montserrat font-weight-bold"
              style="text-transform: uppercase; font-size: 14px"
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
    </template>
  </v-app-bar>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

import QuerySearchField from './fields/QuerySearchField.vue'
import LangSwitcher from '~/components/lang_switcher/LangSwitcher.vue'
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
      logo: '/logos/emaapou5white.svg',
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
.header-tabs {
  background-color: var(--v-secondary-base);
}

.active-tab {
  background-color: var(--v-quaternary-base) !important;
  color: var(--v-accent-darken1) !important;
}

.v-app-bar ::v-deep .v-toolbar__content {
  padding-right: 0;
  padding-left: 0;
  padding-top: 0;
  padding-bottom: 0;
}
#quick-search-btn {
  min-width: 0 !important;
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
  color: rgba(0, 0, 0, 0.54) !important;
}
</style>
