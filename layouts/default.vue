<template>
  <v-app dark>
    <v-app-bar dense app>
      <v-app-bar-title>
        <a
          href="https://geocollections.info"
          class="title deep-orange--text text--darken-2"
          >{{ $t('common.title') }}</a
        >
      </v-app-bar-title>
      <v-spacer /><lang-switcher />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer padless class="mt-4">
      <v-card flat tile>
        <v-card-text class="text-center">
          <a href="https://geokogud.info" target="_blank" rel="noopener">
            <img
              src="~/assets/logos/sarv_logo.svg"
              alt="KIK"
              title="KIK"
              class="footer-logo"
            />
          </a>
          <a href="https://natarc.ut.ee" target="_blank" rel="noopener">
            <img
              src="~/assets/logos/NATARC_transparent.png"
              alt="KIK"
              title="KIK"
              class="footer-logo"
            />
          </a>
          <a href="https://datacite.ut.ee" target="_blank" rel="noopener">
            <img
              src="~/assets/logos/logo_datacite_bw.png"
              alt="KIK"
              title="KIK"
              class="footer-logo"
            />
          </a>
          <a href="https://struktuurifondid.ee" target="_blank" rel="noopener">
            <img
              src="~/assets/logos/EL_mv.png"
              alt="KIK"
              title="KIK"
              class="footer-logo"
            />
          </a>
          <a href="https://kik.ee" target="_blank" rel="noopener">
            <img
              src="~/assets/logos/kik_bw.png"
              alt="KIK"
              title="KIK"
              class="footer-logo"
            />
          </a>
        </v-card-text>
        <!-- TODO: Needs to be translated (translation is at geocollections.info) -->
        <v-card-text class="text-center">
          <i18n path="footer" tag="p">
            <a class="text-link">olle.hints@taltech.ee</a>
            &#x1f16d;
          </i18n>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import LangSwitcher from '~/components/LangSwitcher.vue'

export default {
  components: { LangSwitcher },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
}
</script>

<style lang="scss" scoped>
.title {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 15px !important;
  text-decoration: none;
}

.footer-logo {
  height: 60px;
  width: auto;
  padding: 0 10px;
}
</style>
