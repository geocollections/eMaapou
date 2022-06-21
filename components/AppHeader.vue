<template>
  <v-app-bar
    v-slot="test"
    app
    dark
    clipped-right
    absolute
    height="56"
    :elevation="0"
    :color="transparent ? 'transparent' : 'accent darken-1'"
    :class="{
      'app-bar-full': $vuetify.breakpoint.mdAndUp,
      'app-bar-mobile': !$vuetify.breakpoint.mdAndUp,
    }"
    style="z-index: 2060"
  >
    <v-toolbar-title class="align-self-center">
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
    </v-toolbar-title>
    <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp" class="ml-10">
      {{ test }}
      <v-btn
        id="browse_menu_btn"
        aria-label="browse"
        text
        class="montserrat"
        style="text-transform: capitalize; font-size: 0.875rem"
      >
        {{ $t('common.browse') }}
        <v-icon color="accent lighten-2" class="ml-1">mdi-chevron-down</v-icon>
      </v-btn>
      <v-menu
        activator="#browse_menu_btn"
        content-class="elevation-2 mt-1"
        transition="slide-y-transition"
        offset-y
        bottom
        right
        attach=""
      >
        <v-card max-width="1000">
          <v-card-actions class="d-flex align-baseline">
            <v-list class="mx-3" width="250">
              <base-menu-list-item
                v-for="(item, index) in browseGeography"
                :key="`browse-geography-item-${index}`"
                class="my-1"
                :icon="item.icon"
                :label="$t(item.label)"
                nuxt
                :to="localePath({ name: item.routeName })"
              />
            </v-list>

            <!-- <v-divider class="mx-3" vertical /> -->
            <v-list class="mx-3" width="250">
              <base-menu-list-item
                v-for="(item, index) in browseLab"
                :key="`browse-lab-item-${index}`"
                class="my-1"
                :icon="item.icon"
                :label="$t(item.label)"
                nuxt
                :to="localePath({ name: item.routeName })"
              />
            </v-list>
            <!-- <v-divider class="mx-3" vertical /> -->
            <v-list class="mx-3" width="250">
              <base-menu-list-item
                v-for="(item, index) in browseTaxon"
                :key="`browse-lab-item-${index}`"
                class="my-1"
                :icon="item.icon"
                :label="$t(item.label)"
                nuxt
                :to="localePath({ name: item.routeName })"
              />
            </v-list>
          </v-card-actions>
          <v-divider class="mx-5 mt-3" />
          <v-card-actions>
            <v-list class="mx-3" width="250">
              <base-menu-list-item
                class="my-1"
                icon="mdi-file-image-outline"
                :label="$t('photo.pageTitle')"
                nuxt
                :to="localePath({ name: 'photo' })"
              />
            </v-list>
          </v-card-actions>
        </v-card>
      </v-menu>

      <v-btn
        nuxt
        aria-label="about page"
        text
        class="montserrat font-weight-medium"
        style="text-transform: capitalize"
        :to="localePath({ name: 'about' })"
      >
        {{ $t('common.about') }}
      </v-btn>

      <v-btn
        nuxt
        aria-label="news page"
        text
        class="montserrat font-weight-medium"
        style="text-transform: capitalize"
        :to="localePath({ name: 'news' })"
      >
        {{ $t('common.news') }}
      </v-btn>
      <v-btn
        id="services_menu_btn"
        aria-label="browse"
        text
        class="montserrat"
        style="text-transform: capitalize; font-size: 0.875rem"
      >
        {{ $t('common.services') }}
        <v-icon color="accent lighten-2" class="ml-1">mdi-chevron-down</v-icon>
      </v-btn>
      <v-menu
        activator="#services_menu_btn"
        content-class="elevation-2 mt-1"
        transition="slide-y-transition"
        offset-y
        bottom
        right
        attach=""
      >
        <v-card width="550">
          <v-card-actions class="d-block">
            <v-list
              style="max-height: 450px; flex-flow: column wrap"
              class="d-flex"
            >
              <base-menu-list-item
                v-for="(tabId, index) in services.ids"
                :key="`service-${index}`"
                class="my-1"
                target="_blank"
                style="width: 250px"
                :href="services[tabId].href"
                :label="$t(services[tabId].title)"
                label-only
              />
            </v-list>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar-items>
    <v-spacer />
    <v-toolbar-items
      class="align-center"
      :style="{
        width: !$vuetify.breakpoint.mdAndUp && showSearch ? '100%' : 'inherit',
      }"
    >
      <div
        v-if="showSearch"
        class="d-flex elevation-0 rounded mr-2"
        :class="{ 'mobile-search mx-5': !$vuetify.breakpoint.mdAndUp }"
      >
        <input-search
          v-model="query"
          class="rounded-r-0 montserrat"
          background-color="white"
          dense
          flat
          :autofocus="false"
          :placeholder="$t('common.search')"
          @enter="$router.push(localePath({ name: 'search' }))"
        />
        <v-hover v-slot="{ hover }">
          <v-btn
            height="38"
            width="48"
            elevation="0"
            :color="hover ? 'warning' : 'grey lighten-2'"
            class="rounded-l-0"
            @click="$router.push(localePath({ name: 'search' }))"
          >
            <v-icon color="accent">mdi-magnify</v-icon>
          </v-btn>
        </v-hover>
      </div>
      <language-switcher v-if="$vuetify.breakpoint.mdAndUp" />
      <v-btn
        v-if="!$vuetify.breakpoint.mdAndUp"
        text
        class="montserrat"
        aria-label="Open navigation drawer"
        style="text-transform: capitalize"
        @click.stop="$emit('toggle:navigationDrawer')"
      >
        <v-icon color="accent lighten-2" size="font-size: 24px"
          >mdi-menu</v-icon
        >
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

import InputSearch from './input/InputSearch.vue'
import BaseMenuListItem from './base/BaseMenuListItem.vue'
import LanguageSwitcher from '~/components/language/LanguageSwitcher.vue'
import {
  BROWSE_GEOLOGY_LIST,
  BROWSE_LAB_LIST,
  BROWSE_TAXON_LIST,
  SERVICES,
} from '~/constants'
export default {
  name: 'AppHeader',
  components: { LanguageSwitcher, InputSearch, BaseMenuListItem },
  props: {
    drawer: Boolean,
    showSearch: {
      type: Boolean,
      default: true,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      browseGeography: BROWSE_GEOLOGY_LIST,
      browseLab: BROWSE_LAB_LIST,
      browseTaxon: BROWSE_TAXON_LIST,
      logo: '/logos/emaapou5white.svg',
      logoCompact: '/logos/emaapou_short.svg',
      services: SERVICES,
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

.app-bar-mobile ::v-deep .v-toolbar__content {
  max-width: 1785px;
  margin-left: auto;
  margin-right: auto;
  padding-right: 0px;
  // padding-left: 20px;
}

.app-bar-transparent {
  &:hover {
    background-color: #333333 !important;
  }
}

.app-bar-full ::v-deep .v-toolbar__content {
  max-width: 1785px;
  margin-left: auto;
  margin-right: auto;
  // padding-right: 0px;
  // padding-left: 20px;
  // border-bottom: map-get($map: $grey, $key: 'lighten-2') solid 1px !important;
}

.active-card {
  background-color: rgba(9, 98, 124, 0.12) !important;

  & div {
    color: var(--v-accent-lighten1) !important;
  }

  & .v-icon {
    color: var(--v-accent-lighten1) !important;
  }
}
</style>
