<template>
  <v-app dark>
    <v-main>
      <app-header />
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <app-footer />
  </v-app>
</template>

<script>
import AppFooter from '@/components/AppFooter'
import AppHeader from '@/components/AppHeader'

export default {
  components: { AppHeader, AppFooter },
}
</script>

<style lang="scss" scoped></style>
