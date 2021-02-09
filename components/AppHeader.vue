<template>
  <v-app-bar dense app>
    <v-app-bar-title>
      <a
        href="https://geocollections.info"
        class="title deep-orange--text text--darken-2"
        >{{ $t('common.title') }}</a
      >
    </v-app-bar-title>
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
