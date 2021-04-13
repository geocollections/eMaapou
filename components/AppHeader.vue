<template>
  <v-app-bar app color="#5c6598" dark>
    <template #img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
      ></v-img>
    </template>

    <v-toolbar-items>
      <v-app-bar-title class="app-title align-self-center">
        <nuxt-link :to="localePath({ path: '/' })" class="title-link">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <span
                v-bind="attrs"
                class="header-text text-none text-nowrap"
                :class="{
                  emaapou: !isDetail,
                  'emaapou-detail': isDetail,
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
      text
      :to="localePath({ name: 'about' })"
    >
      <template #default>
        <span class="header-text">
          {{ $t('common.about') }}
        </span>
      </template>
    </v-btn>
    <links v-if="$vuetify.breakpoint.smAndUp" />
    <app-header-search class="mr-3" />
    <lang-switcher />
    <lang-switcher-fast v-if="false" :is-detail="isDetail" />

    <template v-if="$vuetify.breakpoint.smAndUp" #extension>
      <v-tabs
        :value="tabValue"
        align-with-title
        class="tabs"
        optional
        show-arrows
        center-active
        centered
      >
        <v-tab
          v-for="(item, index) in tabs"
          :key="index"
          nuxt
          :exact="item.name !== 'search'"
          :to="localePath({ name: item.name })"
          ><b>{{ $t(`common.${item.lang}`) }}</b></v-tab
        >
      </v-tabs>
    </template>

    <v-btn
      v-if="$vuetify.breakpoint.xsOnly"
      small
      icon
      class="ml-3 mr-1"
      aria-label="Open navigation drawer"
      style="height: 32px; width: 32px"
      @click.stop="$emit('toggle:navigationDrawer')"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import Links from '@/components/Links'
import LangSwitcher from '@/components/LangSwitcher'
import AppHeaderSearch from '~/components/AppHeaderSearch'
import LangSwitcherFast from '~/components/LangSwitcherFast'
export default {
  name: 'AppHeader',
  components: { LangSwitcherFast, AppHeaderSearch, LangSwitcher, Links },
  props: {
    isDetail: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      tabs: [
        {
          name: 'drillcore',
          lang: 'drillcores',
        },
        {
          name: 'locality',
          lang: 'localities',
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
.tabs {
  background-color: #7781b5;
}
</style>
