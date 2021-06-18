<template>
  <v-app-bar
    app
    dark
    style="z-index: 2050"
    :color="isLanding ? 'transparent' : 'primary'"
    :elevation="isLanding ? 0 : 4"
    :class="{
      'gradient-background': !isLanding,
      'gradient-background-front': isLanding,
    }"
  >
    <v-toolbar-items>
      <v-app-bar-title class="ml-3 align-self-center app-title">
        <nuxt-link :to="localePath({ path: '/' })">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-img
                class="transition-logo"
                :height="45"
                :width="90"
                contain
                :src="logo"
                v-bind="attrs"
                v-on="on"
              />
            </template>

            <span>{{ $t('landing.goToFrontpage') }}</span>
          </v-tooltip>
        </nuxt-link>
      </v-app-bar-title>
    </v-toolbar-items>
    <v-divider
      v-if="$vuetify.breakpoint.mdAndUp"
      vertical
      inset
      class="mx-3 white"
    />
    <div v-if="$vuetify.breakpoint.mdAndUp" class="montserrat">
      {{ $t('slogan') }}
    </div>

    <v-toolbar-items class="ml-3">
      <v-btn
        v-show="$vuetify.breakpoint.smAndUp"
        nuxt
        aria-label="search"
        text
        class="montserrat"
        :to="localePath({ name: 'search' })"
      >
        {{ $t('common.search') }}
      </v-btn>
      <v-btn
        v-show="$vuetify.breakpoint.smAndUp"
        nuxt
        aria-label="about page"
        text
        class="montserrat"
        :to="localePath({ name: 'about' })"
      >
        {{ $t('common.about') }}
      </v-btn>
    </v-toolbar-items>
    <v-spacer />
    <v-toolbar-items>
      <lang-switcher v-show="$vuetify.breakpoint.smAndUp" />
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

    <template v-if="$vuetify.breakpoint.smAndUp && !isLanding" #extension>
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
          class="montserrat"
          >{{ tab.text }}</v-tab
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
    isDetail: {
      type: Boolean,
      required: false,
      default: false,
    },
    drawer: Boolean,
  },
  data() {
    return {
      tabs: [
        {
          routeName: 'locality',

          text: this.$t('common.localities'),
        },
        {
          routeName: 'site',
          text: this.$t('common.sites'),
        },
        {
          routeName: 'drillcore',
          text: this.$t('common.drillcores'),
        },
        {
          routeName: 'sample',
          text: this.$t('common.samples'),
        },
        {
          routeName: 'analytical-data',
          text: this.$t('common.analyticalData'),
        },
        { routeName: 'dataset', text: this.$t('common.datasets') },
        {
          routeName: 'taxon',
          text: this.$t('common.taxa'),
        },
        { routeName: 'photo', text: this.$t('common.photo') },
      ],
      logo: require('~/assets/logos/emaapou5white.svg'),
    }
  },
  computed: {
    isLanding() {
      return this.getRouteBaseName().startsWith('index')
    },
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
.app-title >>> .v-app-bar-title__content {
  width: unset !important;
}

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

.transition-logo {
  transition: width 250ms ease-in-out, height 250ms ease-in-out;
}

$gradient-col: rgb(150, 163, 177);
$gradient-col-sec: rgb(80, 149, 177);

.gradient-background-front {
  background: linear-gradient(
    320deg,
    rgba($gradient-col, 0.6),
    rgba($gradient-col-sec, 0.6)
  ) !important;
}

.gradient-background {
  background: linear-gradient(
    320deg,
    rgba($gradient-col, 1),
    rgba($gradient-col-sec, 1)
  ) !important;
}
</style>
