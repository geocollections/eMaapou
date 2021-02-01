<template>
  <div>
    <v-menu transition="slide-y-transition" offset-y bottom right>
      <template #activator="{ on, attrs }">
        <v-btn
          aria-label="select language"
          class="ml-auto d-block"
          icon
          dark
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
          :to="switchLocalePath(locale.code)"
        >
          <v-list-item-title class="d-flex">
            <span
              v-if="locale.code === 'et'"
              class="flag flag-et flag-squared flag-circle mr-2 lang-button"
            />
            <span
              v-if="locale.code === 'en'"
              class="flag flag-en flag-squared flag-circle mr-2 lang-button"
            />
            <span class="align-self-center">{{ locale.name }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
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
        'flag-squared': true,
        'flag-circle': true,
        'lang-button': true,
      }
    },
  },
}
</script>

<style scoped>
.lang-buttons {
  /*text-align: right;*/
  /*position: absolute;*/
  right: 0;
}

.lang-button {
  height: 28px;
  width: 28px !important;
}

.flag {
  position: relative;
  display: inline-block;
  width: 1.33333333em;
  line-height: 1em;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}

.flag:before {
  content: '\A0';
}

.flag-et {
  background-image: url('/et.svg');
}

.flag-en {
  background-image: url('/en.svg');
}

.flag-squared {
  width: 1em;
}

.flag-circle {
  border-radius: 100%;
}
</style>
