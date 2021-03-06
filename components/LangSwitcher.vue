<template>
  <v-menu transition="slide-y-transition" offset-y bottom right>
    <template #activator="{ on, attrs }">
      <v-btn
        aria-label="select language"
        class="ml-auto d-block lang-button"
        icon
        v-bind="attrs"
        v-on="on"
      >
        <span :class="classObject" />
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(locale, i) in availableLocales"
        :key="i"
        dense
        class="header-menu-item"
        :to="switchLocalePath(locale.code)"
      >
        <v-list-item-title class="d-flex">
          <span
            v-if="locale.code === 'et'"
            class="flag flag-et mr-2 lang-icon"
          />
          <span
            v-if="locale.code === 'en'"
            class="flag flag-en mr-2 lang-icon"
          />
          <span class="align-self-center">{{ locale.name }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'LangSwitcher',
  computed: {
    availableLocales() {
      return this.$i18n.locales
    },
    classObject() {
      return {
        flag: true,
        'flag-en': this.$i18n.locale === 'en',
        'flag-et': this.$i18n.locale === 'et',
        'lang-icon': true,
      }
    },
  },
}
</script>

<style scoped lang="scss">
.lang-button {
  height: 30px !important;
  width: 30px !important;
}

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

  width: 1em;

  border-radius: 100%;
}

.flag:before {
  content: '\A0';
}

.flag-et {
  background-image: url('~assets/et.svg');
}

.flag-en {
  background-image: url('~assets/en.svg');
}
</style>
