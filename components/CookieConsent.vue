<template>
  <div
    v-if="settings.showCookiePolicy"
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
            'text-sm': $vuetify.display.xs,
          }"
        >
          {{ $t("cookiePolicy.introduction") }}

          <nuxt-link
            class="text-link text-decoration-none"
            :to="localePath({ name: 'cookie-policy' })"
          >
            {{ $t("cookiePolicy.readMoreButton") }}
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
          {{ $t("cookiePolicy.reject") }}
        </v-btn>
        <v-btn
          width="100"
          color="warning white--text"
          class="text-none montserrat"
          @click="handleAcceptConsent"
        >
          {{ $t("cookiePolicy.accept") }}
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { mdiCookie } from "@mdi/js";

const { $matomo } = useNuxtApp();
const settings = useSettings();
const icons = computed(() => {
  return { mdiCookie };
});
const localePath = useLocalePath();
const handleAcceptConsent = () => {
  settings.cookieConsent = true;
  settings.showCookieConsent = false;
  $matomo?.rememberCookieConsentGiven();
};
const handleRejectConsent = () => {
  settings.showCookieConsent = false;
};
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
