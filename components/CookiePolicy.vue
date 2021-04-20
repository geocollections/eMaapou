<template>
  <v-card
    v-if="cookiePolicy"
    tile
    class="cookie-policy py-3 px-6"
    elevation="12"
  >
    <div class="d-flex flex-row justify-center">
      <div
        class="align-self-center pr-3"
        :class="{
          'text-sm': $vuetify.breakpoint.smAndDown,
        }"
      >
        {{ $t('cookiePolicy.introduction') }}

        <nuxt-link
          class="text-link text-decoration-none"
          :title="$t('cookiePolicy.readMoreButton')"
          :to="localePath({ name: 'terms_of_use' })"
        >
          {{ $t('cookiePolicy.readMoreButton') }}
          <v-icon small color="primary darken-2">mdi-cookie</v-icon>
        </nuxt-link>
      </div>

      <div class="align-self-center">
        <v-btn
          color="primary darken-2 white--text"
          :title="$t('cookiePolicy.acceptAndClose')"
          @click="closeCookiePolicy"
        >
          OK
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'CookiePolicy',
  computed: {
    ...mapState('settings', ['cookiePolicy']),
  },
  methods: {
    ...mapActions('settings', ['closeCookiePolicy']),
  },
}
</script>

<style scoped>
.cookie-policy {
  position: fixed;
  bottom: 0;
  z-index: 100000;
  width: 100%;
}

.text-sm {
  font-size: 14px;
}
</style>
