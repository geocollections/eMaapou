<template>
  <v-app-bar
    app
    dark
    style="z-index: 2050"
    color="primary"
    class="gradient-background"
    :height="isLanding ? ($vuetify.breakpoint.smAndDown ? 56 : 112) : 64"
  >
    <v-toolbar-items>
      <go-back-button v-if="showBack" />
      <v-app-bar-title class="align-self-center app-title ml-3">
        <nuxt-link :to="localePath({ path: '/' })">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-img
                class="transition-logo"
                :height="
                  isLanding ? ($vuetify.breakpoint.smAndDown ? 45 : 65) : 45
                "
                :width="
                  isLanding ? ($vuetify.breakpoint.smAndDown ? 90 : 130) : 90
                "
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
      class="quaternary mx-3"
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
        :text="$vuetify.breakpoint.smAndUp"
        :icon="!$vuetify.breakpoint.smAndUp"
        class="montserrat"
        :class="{ 'header-icon-button': !$vuetify.breakpoint.smAndUp }"
        aria-label="Open navigation drawer"
        :small="!$vuetify.breakpoint.smAndUp"
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
          v-for="(item, index) in tabs"
          :key="index"
          nuxt
          active-class="active-tab font-weight-bold"
          :to="localePath({ name: item.name })"
          class="montserrat"
          >{{ $t(`common.${item.lang}`) }}</v-tab
        >
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
import GoBackButton from './GoBackButton.vue'
import LangSwitcher from '~/components/lang_switcher/LangSwitcher'
export default {
  name: 'AppHeader',
  components: { LangSwitcher, GoBackButton },
  props: {
    isDetail: {
      type: Boolean,
      required: false,
      default: false,
    },
    drawer: Boolean,
    showBack: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tabs: [
        {
          name: 'locality',
          lang: 'localities',
        },
        {
          name: 'site',
          lang: 'sites',
        },
        {
          name: 'drillcore',
          lang: 'drillcores',
        },
        {
          name: 'sample',
          lang: 'samples',
        },
        {
          name: 'analytical_data',
          lang: 'analyticalData',
        },
        { name: 'dataset', lang: 'datasets' },
        {
          name: 'taxon',
          lang: 'taxa',
        },
        { name: 'photo', lang: 'photo' },
      ],
      logo: require('~/assets/logos/emaapou5white.svg'),
    }
  },
  computed: {
    isLanding() {
      return this.$route.name.startsWith('index')
    },
    isSearchPage() {
      return this.$route.name.startsWith('search')
    },
    isNotSearchPath() {
      return !this.$route.path.startsWith('/search')
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

<style scoped>
.app-title >>> .v-app-bar-title__content {
  width: unset !important;
}

.header-tabs {
  background-color: var(--v-secondary-base);
}

.active-tab {
  background-color: var(--v-quaternary-base) !important;
  color: var(--v-tertiary-base) !important;
}

.v-app-bar ::v-deep .v-toolbar__content {
  padding-right: 0;
  padding-left: 0;
}

.transition-logo {
  transition: width 250ms ease-in-out, height 250ms ease-in-out;
}

.gradient-background {
  background: linear-gradient(
    320deg,
    var(--v-header-base),
    rgba(0, 0, 0, 1)
  ) !important;
}
</style>
