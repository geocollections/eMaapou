<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col>
        <h1 class="text-center">{{ $t('title') }}</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col>
        <nuxt-link :to="localePath({ name: 'search' })"> Search</nuxt-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {}
</script>
