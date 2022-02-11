<template>
  <v-menu
    content-class="elevation-2 mt-1"
    transition="slide-y-transition"
    offset-y
    bottom
    right
  >
    <template #activator="{ on, attrs }">
      <v-btn
        aria-label="select language"
        class="d-block"
        icon
        :color="color"
        v-bind="attrs"
        v-on="on"
      >
        <span class="elevation-1" :class="classObject" />
      </v-btn>
    </template>

    <language-list />
  </v-menu>
</template>

<script>
import LanguageList from '~/components/language/LanguageList'
export default {
  name: 'LanguageSwitcher',
  components: { LanguageList },
  props: {
    color: {
      type: String,
      default: 'white',
    },
  },
  computed: {
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
  background-image: url('~assets/et.svg');
}

.flag-en {
  background-image: url('~assets/en.svg');
}
</style>
