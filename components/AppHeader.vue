<template>
  <v-app-bar
    app
    color="#6A76AB"
    shrink-on-scroll
    prominent
    hide-on-scroll
    src="https://picsum.photos/1920/1080?random"
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
        <span class="header-text title text-none text-nowrap">{{
          $t('common.home')
        }}</span>
      </nuxt-link>
    </v-app-bar-title>

    <v-spacer />

    <app-header-search v-if="isNotSearchPath" class="d-none d-sm-flex" />
    <links />
    <lang-switcher />

    <template #extension>
      <v-tabs align-with-title>
        <v-tab nuxt exact :to="localePath({ name: 'search' })">{{
          $t('common.search')
        }}</v-tab>
        <v-tab nuxt exact :to="localePath({ name: 'drillcore' })">{{
          $t('common.drillcore')
        }}</v-tab>
        <v-tab nuxt exact :to="localePath({ name: 'locality' })">{{
          $t('common.locality')
        }}</v-tab>
        <v-tab nuxt exact :to="localePath({ name: 'sample' })">{{
          $t('common.sample')
        }}</v-tab>
        <v-tab nuxt exact :to="localePath({ name: 'analysis' })">{{
          $t('common.analysis')
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
