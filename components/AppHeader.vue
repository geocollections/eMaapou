<template>
  <v-app-bar
    app
    dark
    dense
    height="70"
    style="z-index: 2050"
    class="emp-header"
  >
    <v-toolbar-items>
      <v-app-bar-title class="align-self-center">
        <nuxt-link :to="localePath({ path: '/' })" class="">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-img
                max-height="40"
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
    <div
      style="margin: 0 10px; border-left: solid #fff 1px; padding: 0 0 0 10px"
    >
      {{ $t('slogan') }}
    </div>
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

    <template v-if="$vuetify.breakpoint.smAndUp" #extension>
      <v-tabs
        :value="tabValue"
        align-with-title
        class="emp-headermenu"
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
          active-class="emp-activetab"
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
import AppHeaderSearch from '~/components/AppHeaderSearch'
export default {
  name: 'AppHeader',
  components: { AppHeaderSearch, Links },
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
