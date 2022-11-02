<template>
  <div
    v-if="cookiePolicy"
    class="cookie-policy py-3 px-6 d-flex justify-center"
  >
    <v-card class="cookie-policy-card py-3 px-6" elevation="12">
      <div class="d-sm-flex flex-row justify-center">
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
            :to="localePath({ name: 'terms' })"
          >
            {{ $t('cookiePolicy.readMoreButton') }}
            <v-icon small color="primary darken-2">
              {{ icons.mdiCookie }}
            </v-icon>
          </nuxt-link>
        </div>

        <div class="align-self-center text-right mt-2 mt-sm-0">
          <v-btn
            color="warning white--text"
            class="text-capitalize montserrat"
            :title="$t('cookiePolicy.acceptAndClose')"
            @click="handleConsent"
          >
            {{ $t('common.accept') }}
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mdiCookie } from '@mdi/js'
export default {
  name: 'CookiePolicy',

  computed: {
    ...mapFields('settings', ['cookiePolicy']),
    icons() {
      return { mdiCookie }
    },
  },
  methods: {
    handleConsent() {
      this.cookiePolicy = false
      this.$matomo.rememberConsentGiven()
      this.$matomo.rememberCookieConsentGiven()
    },
  },
}
</script>

<style scoped>
.cookie-policy {
  pointer-events: none;
  position: fixed;
  bottom: 0;
  z-index: 100000;
  width: 100%;
}
.cookie-policy-card {
  pointer-events: auto;
}
.text-sm {
  font-size: 14px;
}
</style>
