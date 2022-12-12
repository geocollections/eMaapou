<template>
  <div
    v-if="$accessor.settings.cookiePolicy"
    class="cookie-policy py-3 px-6 d-flex justify-center"
  >
    <v-card class="cookie-policy-card py-3 px-3" elevation="2">
      <div class="d-flex justify-center mb-2">
        <v-icon left color="accent">
          {{ icons.mdiCookie }}
        </v-icon>
        <div
          class="align-self-center pr-3"
          :class="{
            'text-sm': $vuetify.breakpoint.xsOnly,
          }"
        >
          {{ $t('cookiePolicy.introduction') }}

          <nuxt-link
            class="text-link text-decoration-none"
            :to="localePath({ name: 'cookie-policy' })"
          >
            {{ $t('cookiePolicy.readMoreButton') }}
          </nuxt-link>
        </div>
      </div>
      <div class="align-self-center text-right mt-2 mt-sm-0">
        <v-btn
          class="text-none montserrat"
          width="100"
          outlined
          color="grey darken-1"
          @click="handleRejectConsent"
        >
          {{ $t('cookiePolicy.reject') }}
        </v-btn>
        <v-btn
          width="100"
          color="warning white--text"
          class="text-none montserrat"
          @click="handleAcceptConsent"
        >
          {{ $t('cookiePolicy.accept') }}
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { mdiCookie } from '@mdi/js'
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { useAccessor } from '~/composables/useAccessor'
export default defineComponent({
  name: 'CookieConsent',
  setup() {
    const { $matomo } = useContext()
    const accessor = useAccessor()
    const icons = computed(() => {
      return { mdiCookie }
    })
    const handleAcceptConsent = () => {
      accessor.settings.setCookiePolicy(false)
      $matomo.rememberConsentGiven()
      $matomo.rememberCookieConsentGiven()
    }
    const handleRejectConsent = () => {
      accessor.settings.setCookiePolicy(false)
    }
    return { icons, handleAcceptConsent, handleRejectConsent }
  },
})
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
