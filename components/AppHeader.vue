<template>
  <v-app-bar
    app
    color="#6A76AB"
    shrink-on-scroll
    prominent
    hide-on-scroll
    :src="require(`~/assets/header/header1a.jpg`)"
    dark
  >
    <template #img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
      ></v-img>
    </template>

    <v-app-bar-title class="app-title">
      <nuxt-link :to="localePath({ path: '/' })" class="title-link">
        <span class="header-text text-none text-nowrap emaapou">{{
          $t('common.home')
        }}</span>
      </nuxt-link>
    </v-app-bar-title>

    <v-spacer />

    <app-header-search class="d-none d-sm-flex" />
    <links />
    <lang-switcher />

    <template #extension>
      <v-tabs align-with-title>
        <v-tab nuxt exact :to="localePath({ name: 'about' })">{{
          $t('common.about')
        }}</v-tab>
        <v-tab nuxt exact :to="localePath({ name: 'search' })">{{
          $t('common.search')
        }}</v-tab>
        <v-tab nuxt exact :to="localePath({ name: 'drillcore' })">{{
          $t('common.drillcores')
        }}</v-tab>
        <v-tab nuxt exact :to="localePath({ name: 'locality' })">{{
          $t('common.localities')
        }}</v-tab>
        <v-tab nuxt exact :to="localePath({ name: 'sample' })">{{
          $t('common.samples')
        }}</v-tab>
        <v-tab nuxt exact :to="localePath({ name: 'analysis' })">{{
          $t('common.analyses')
        }}</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
import Links from '@/components/Links'
import LangSwitcher from '@/components/LangSwitcher'
import AppHeaderSearch from '~/components/AppHeaderSearch'
export default {
  name: 'AppHeader',
  components: { AppHeaderSearch, LangSwitcher, Links },
  computed: {
    isNotSearchPath() {
      return !this.$route.path.startsWith('/search')
    },
  },
}
</script>

<style scoped>
.app-title >>> .v-app-bar-title__content {
  width: unset !important;
}
</style>
