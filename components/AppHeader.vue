<template>
  <v-app-bar app dark style="z-index: 2050" color="secondary">
    <v-toolbar-items>
      <v-app-bar-title class="app-title align-self-center">
        <nuxt-link :to="localePath({ path: '/' })" class="title-link">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <span
                v-bind="attrs"
                class="header-text text-none text-nowrap"
                :class="{
                  'mr-4': $vuetify.breakpoint.smAndUp,
                }"
                v-on="on"
                >{{ $t('common.home') }}</span
              >
            </template>

            <span>{{ $t('landing.goToFrontpage') }}</span>
          </v-tooltip>
        </nuxt-link>
      </v-app-bar-title>

      <!-- BUTTONS ON DENSE BAR -->
      <!-- <template>
        <v-btn
          v-for="(item, index) in tabs"
          :key="index"
          nuxt
          text
          :class="{
            'd-none d-lg-flex': item.name !== 'about' && item.name !== 'search',
            'd-none d-md-flex': item.name === 'about' || item.name === 'search',
          }"
          style="color: rgba(255, 255, 255, 0.6)"
          :exact="item.name !== 'search'"
          :to="localePath({ name: item.name })"
          >{{ $t(`common.${item.lang}`) }}</v-btn
        >
      </template> -->
    </v-toolbar-items>

    <v-spacer />

    <v-btn
      v-show="$vuetify.breakpoint.smAndUp"
      nuxt
      aria-label="about page"
      class="font-weight-bold"
      text
      :to="localePath({ name: 'about' })"
    >
      {{ $t('common.about') }}
    </v-btn>

    <links v-if="false" />

    <app-header-search class="mx-3" />

    <lang-switcher />

    <lang-switcher-fast v-if="false" />

    <template v-if="$vuetify.breakpoint.smAndUp" #extension>
      <v-tabs
        :value="tabValue"
        align-with-title
        class="tertiary"
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
          active-class="black--text"
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
import Links from '@/components/Links'
import LangSwitcher from '~/components/lang_switcher/LangSwitcher'
import AppHeaderSearch from '~/components/AppHeaderSearch'
import LangSwitcherFast from '~/components/lang_switcher/LangSwitcherFast'
export default {
  name: 'AppHeader',
  components: { LangSwitcherFast, AppHeaderSearch, LangSwitcher, Links },
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
        { name: 'stratigraphy', lang: 'stratigraphy' },
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
      ],
    }
  },
  computed: {
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
</style>
