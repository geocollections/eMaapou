<template>
  <v-app-bar dense app>
    <nuxt-link :to="'/' + $i18n.locale">
      <span class="header-text title">{{ $t('common.home') }}</span>
    </nuxt-link>
    &nbsp;|&nbsp;
    <nuxt-link :to="'/' + $i18n.locale + '/search'">
      <span class="header-text title">{{ $t('common.search') }}</span>
    </nuxt-link>
    <v-spacer />
    <links />
    <lang-switcher />
  </v-app-bar>
</template>

<script>
import Links from '@/components/Links'
import LangSwitcher from '@/components/LangSwitcher'
export default {
  name: 'AppHeader',
  components: { LangSwitcher, Links },
}
</script>

<style scoped>
.title {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 15px !important;
  text-decoration: none;
}
</style>
