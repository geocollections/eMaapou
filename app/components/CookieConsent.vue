<script setup lang="ts">
// const { $matomo } = useNuxtApp();
// const settings = useSettings();
// const localePath = useLocalePath();
// function handleAcceptConsent() {
//   settings.cookieConsent = true;
// settings.showCookieConsent = false;
// $matomo?.rememberCookieConsentGiven();
// }
// function handleRejectConsent() {
// settings.showCookieConsent = false;
// }
</script>

<template>
  <!-- <div -->
  <!--   v-if="settings.showCookiePolicy" -->
  <!--   class="cookie-policy py-3 px-6 d-flex justify-center" -->
  <!-- > -->
  <!--   <div class="cookie-policy-card py-3 px-3" elevation="2"> -->
  <!--     <div class="d-flex justify-center mb-2"> -->
  <!--       <VIcon start color="accent"> -->
  <!--         {{ icons.mdiCookie }} -->
  <!--       </VIcon> -->
  <!--       <div -->
  <!--         class="align-self-center pr-3" -->
  <!--         :class="{ -->
  <!--         }" -->
  <!--       > -->
  <!--         {{ $t("cookiePolicy.introduction") }} -->
  <!---->
  <!--         <NuxtLink -->
  <!--           class="text-link text-decoration-none" -->
  <!--           :to="localePath({ name: 'cookie-policy' })" -->
  <!--         > -->
  <!--           {{ $t("cookiePolicy.readMoreButton") }} -->
  <!--         </NuxtLink> -->
  <!--       </div> -->
  <!--     </div> -->
  <!--     <div class="align-self-center text-right mt-2 mt-sm-0"> -->
  <!--       <button -->
  <!--         class="text-none montserrat" -->
  <!--         width="100" -->
  <!--         variant="outlined" -->
  <!--         color="grey-darken-1" -->
  <!--         @click="handleRejectConsent" -->
  <!--       > -->
  <!--         {{ $t("cookiePolicy.reject") }} -->
  <!--       </button> -->
  <!--       <button -->
  <!--         width="100" -->
  <!--         color="warning white--text" -->
  <!--         class="text-none montserrat" -->
  <!--         @click="handleAcceptConsent" -->
  <!--       > -->
  <!--         {{ $t("cookiePolicy.accept") }} -->
  <!--       </button> -->
  <!--     </div> -->
  <!--   </div> -->
  <!-- </div> -->
  <div>
    IMPLEMENT
  </div>
</template>

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
