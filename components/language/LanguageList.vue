<template>
  <v-list class="py-1 px-2">
    <v-list-item
      v-for="(locale, i) in availableLocales"
      :key="i"
      nuxt
      class="header-menu-item rounded my-1"
      :class="{ 'header-menu-item-active': $i18n.locale === locale.code }"
      :to="switchLocalePath(locale.code)"
    >
      <v-list-item-title class="d-flex py-1">
        <v-icon
          v-show="$i18n.locale === locale.code"
          class="mr-2"
          color="accent"
        >
          mdi-check
        </v-icon>
        <span class="align-self-center montserrat">{{ locale.name }}</span>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: 'LanguageList',
  computed: {
    availableLocales() {
      return this.$i18n.locales
    },
  },
}
</script>

<style scoped>
.lang-icon {
  height: 24px;
  width: 24px !important;
}

.flag {
  position: relative;
  display: inline-block;
  width: 1em;
  line-height: 1em;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  border-radius: 100%;
}

.flag:before {
  content: '\A0';
}

.flag-et {
  background-image: url('~/assets/et.svg');
}

.flag-en {
  background-image: url('~/assets/en.svg');
}
</style>
