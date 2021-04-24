<template>
  <v-footer padless class="mt-4">
    <v-card width="100%" flat tile color="tertiary">
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
      <!--      <v-card-text class="text-center">
        {{ $t('footerPreliminary') }}
      </v-card-text>-->
      <v-card-text class="text-center mx-auto" style="max-width: 700px">
        <i18n path="footer" tag="div">
          <a
            v-for="(item, index) in textLinks"
            :key="index"
            :href="item.href"
            class="text-link"
            target="FooterLink"
            >{{ item.text }}</a
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
          src: require('~/assets/logos/sarv_logo1b.svg'),
          title: 'footerLinks.sarv',
          alt: 'footerLinks.sarv',
        },
        {
          href: 'https://natarc.ut.ee',
          src: require('~/assets/logos/natarclogovalge1.png'),
          title: 'footerLinks.natarc',
          alt: 'footerLinks.natarc',
        },
        {
          href: 'https://taltech.ee/geoloogia-instituut',
          src: require('~/assets/logos/tutaltech2.png'),
          title: 'footerLinks.ttu',
          alt: 'footerLinks.ttu',
        },
        {
          href: 'http://www.natmuseum.ut.ee/et/content/geoloogiakogud',
          src: require('~/assets/logos/TY_logo_ring_jooneta_valge.png'),
          title: 'footerLinks.tu',
          alt: 'footerLinks.tu',
        },
        {
          href: 'https://loodusmuuseum.ee/geoloogilised-kogud',
          src: require('~/assets/logos/ELM_logo_white1.png'),
          title: 'footerLinks.elm',
          alt: 'footerLinks.elm',
        },
        /* {
          href: 'https://struktuurifondid.ee',
          src: require('~/assets/logos/EL_mv.png'),
          title: 'footerLinks.el',
          alt: 'footerLinks.el',
        }, */
      ],
      textLinks: [
        {
          href: 'https://creativecommons.org/licenses/by-sa/3.0/',
          text: 'CC BY-SA',
        },
        {
          href: 'https://natarc.ut.ee/',
          text: 'NATARC',
        },
        {
          href: 'https://geocollections.info/',
          text: 'SARV',
        },
        {
          href: 'https://taltech.ee/geoloogia-instituut',
          text: 'TalTech',
        },
        {
          href: 'https://nuxtjs.org/',
          text: 'Nuxt.js',
        },
        {
          href: 'https://github.com/geocollections/EMA',
          text: 'GitHub',
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

.v-card__text {
  font-size: 0.7em;
  font-weight: 400;
  color: white !important;
}

.v-card__text a:visited,
.v-card__text a:link,
.v-card__text a:active {
  color: white !important;
  font-weight: 600;
}

.footer-logo {
  height: 50px;
  width: auto;
  /*padding: 0 10px;*/
}

.hall {
  background-color: #5c6598 !important;
  border-color: #5c6598 !important;
}
</style>
