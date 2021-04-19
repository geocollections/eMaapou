<template>
  <v-app-bar app dark dense height="70" style="z-index: 2050" color="primary">
    <v-toolbar-items>
      <v-app-bar-title class="align-self-center">
        <nuxt-link :to="localePath({ path: '/' })">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-img
                max-height="50"
                max-width="90"
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
    <div
      v-if="$vuetify.breakpoint.mdAndUp"
      style="font-family: 'Montserrat', sans-serif"
    >
      {{ $t('slogan') }}
    </div>
    <v-spacer />
    <app-header-search v-if="!isLanding && !isSearchPage" class="mx-3" />
    <v-btn
      v-show="$vuetify.breakpoint.smAndUp"
      nuxt
      aria-label="about page"
      class="font-weight-bold mr-3"
      text
      :to="localePath({ name: 'about' })"
    >
      {{ $t('common.about') }}
    </v-btn>

    <lang-switcher v-show="$vuetify.breakpoint.smAndUp" />

    <template v-if="$vuetify.breakpoint.smAndUp" #extension>
      <v-tabs
        :value="tabValue"
        align-with-title
        class="header-tabs"
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
          active-class="active-tab"
          :to="localePath({ name: item.name })"
          ><b>{{ $t(`common.${item.lang}`) }}</b></v-tab
        >
      </v-tabs>
    </template>

    <v-btn
      :text="$vuetify.breakpoint.smAndUp"
      :icon="!$vuetify.breakpoint.smAndUp"
      class="font-weight-bold"
      :class="{ 'mr-1 header-icon-button': !$vuetify.breakpoint.smAndUp }"
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
  </v-app-bar>
</template>

<script>
import AppHeaderSearch from '~/components/AppHeaderSearch'
import LangSwitcher from '~/components/lang_switcher/LangSwitcher'
export default {
  name: 'AppHeader',
  components: { AppHeaderSearch, LangSwitcher },
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
          name: 'analysis',
          lang: 'analyses',
        },
        { name: 'stratigraphy', lang: 'stratigraphy' },
      ],
      logo: require('~/assets/emaapou5white.svg'),
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
</style>
