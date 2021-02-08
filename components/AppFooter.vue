<template>
  <v-footer padless class="mt-4 footer">
    <v-card width="100%" flat tile>
      <v-card-text class="text-center">
        {{ $t('footerPreliminary') }}
      </v-card-text>
      <v-card-text class="text-center">
        <a
          v-for="(item, index) in imageLinks"
          :key="index"
          :href="item.href"
          target="FooterLink"
          rel="noopener noreferrer"
        >
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <img
                v-bind="attrs"
                :src="item.src"
                :alt="$t(item.alt)"
                class="footer-logo py-1 py-sm-0 px-3"
                v-on="on"
              />
            </template>

            <span>{{ $t(item.title) }}</span>
          </v-tooltip>
        </a>
      </v-card-text>
      <v-card-text class="text-center">
        <i18n path="footer" tag="p">
          <a
            href="https://creativecommons.org/licenses/by-sa/3.0/"
            class="text-link underline text-decoration-none"
            >CC BY-SA</a
          >
          <a
            href="https://natarc.ut.ee/"
            class="text-link underline text-decoration-none"
            >NATARC</a
          >
          <a
            href="https://geocollections.info/"
            class="text-link underline text-decoration-none"
            >SARV</a
          >
          <a
            href="https://taltech.ee/geoloogia-instituut"
            class="text-link underline text-decoration-none"
            >TalTech</a
          >
          <a
            href="https://nuxtjs.org/"
            class="text-link underline text-decoration-none"
            >Nuxt.js</a
          >
          <a
            href="https://github.com/geocollections/GRIS"
            class="text-link underline text-decoration-none"
            >GitHub</a
          >
        </i18n>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      imageLinks: [
        {
          href: 'https://geocollections.info',
          src: require('~/assets/logos/sarv_logo.svg'),
          title: 'footerLinks.kik',
          alt: 'footerLinks.kik',
        },
        {
          href: 'https://natarc.ut.ee',
          src: require('~/assets/logos/NATARC_transparent.png'),
          title: 'footerLinks.natarc',
          alt: 'footerLinks.natarc',
        },
        {
          href: 'https://struktuurifondid.ee',
          src: require('~/assets/logos/EL_mv.png'),
          title: 'footerLinks.el',
          alt: 'footerLinks.el',
        },
      ],
    }
  },
}
</script>

<style scoped>
.footer {
  -webkit-box-shadow: 0 -2px 4px -1px rgba(0, 0, 0, 0.2),
    0 -4px 5px 0 rgba(0, 0, 0, 0.14), 0 -1px 10px 0 rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0 -2px 4px -1px rgba(0, 0, 0, 0.2),
    0 -4px 5px 0 rgba(0, 0, 0, 0.14), 0 -1px 10px 0 rgba(0, 0, 0, 0.12) !important;
}

.footer-logo {
  height: 60px;
  width: auto;
  /*padding: 0 10px;*/
}
</style>
