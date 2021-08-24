<template>
  <v-app-bar
    app
    dark
    clipped-right
    absolute
    :elevation="4"
    class="gradient-background"
  >
    <v-app-bar-title class="ml-3 align-self-center">
      <!--
          NOTE: Tooltip is implemented with activator prop so that it does not disappear before chaning routes.
          Using v-slot:activator added a transition that made the title disappear when clicked.
          https://github.com/vuetifyjs/vuetify/issues/10578 comment by eduardo76 Nov 9, 2020
         -->
      <nuxt-link id="app-bar-title" :to="localePath({ path: '/' })">
        <v-img
          :height="45"
          :width="90"
          contain
          :src="$img(logo, null, { provider: 'static' })"
        />
        <v-tooltip bottom activator="#app-bar-title">
          <span>{{ $t('landing.goToFrontpage') }}</span>
        </v-tooltip>
      </nuxt-link>
    </v-app-bar-title>
    <v-divider
      v-if="$vuetify.breakpoint.mdAndUp"
      vertical
      inset
      class="mx-3 white"
    />
    <div v-if="$vuetify.breakpoint.mdAndUp" class="montserrat">
      {{ $t('slogan') }}
    </div>

    <v-toolbar-items v-show="$vuetify.breakpoint.smAndUp" class="ml-3">
      <v-btn
        nuxt
        aria-label="search"
        text
        class="montserrat"
        :to="localePath({ name: 'search' })"
      >
        {{ $t('common.search') }}
      </v-btn>
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
    <v-toolbar-items>
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

    <template v-if="$vuetify.breakpoint.smAndUp" #extension>
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
          >{{ $t(tab.text) }}</v-tab
        >
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
import LangSwitcher from '~/components/lang_switcher/LangSwitcher.vue'
export default {
  name: 'AppHeader',
  components: { LangSwitcher },
  props: {
    drawer: Boolean,
  },
  data() {
    return {
      tabs: [
        {
          routeName: 'locality',

          text: 'common.localities',
        },
        {
          routeName: 'site',
          text: 'common.sites',
        },
        {
          routeName: 'drillcore',
          text: 'common.drillcores',
        },
        {
          routeName: 'sample',
          text: 'common.samples',
        },
        {
          routeName: 'analytical-data',
          text: 'common.analyticalData',
        },
        { routeName: 'dataset', text: 'common.datasets' },
        // {
        //   routeName: 'taxon',
        //   text: this.$t('common.taxa'),
        // },
        { routeName: 'photo', text: 'common.photo' },
      ],
      logo: '/logos/emaapou5white.svg',
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
</style>
