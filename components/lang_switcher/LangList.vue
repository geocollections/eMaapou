<template>
  <v-list>
    <v-list-item
      v-for="(locale, i) in availableLocales"
      :key="i"
      dense
      class="header-menu-item"
      @click="$i18n.setLocale(locale.code)"
    >
      <v-list-item-title class="d-flex">
        <span v-if="locale.code === 'et'" class="flag flag-et mr-2 lang-icon" />
        <span v-if="locale.code === 'en'" class="flag flag-en mr-2 lang-icon" />
        <span class="align-self-center">{{ locale.name }}</span>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: 'LangList',
  computed: {
    availableLocales() {
      return this.$i18n.locales
    },
  },
}
</script>

<style scoped>
.lang-icon {
  height: 20px;
  width: 20px !important;
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
