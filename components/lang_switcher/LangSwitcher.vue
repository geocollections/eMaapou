<template>
  <v-menu transition="slide-y-transition" offset-y bottom right>
    <template #activator="{ on, attrs }">
      <v-btn
        aria-label="select language"
        class="d-block"
        icon
        v-bind="attrs"
        v-on="on"
      >
        <span :class="classObject" />
      </v-btn>
    </template>

    <lang-list />
  </v-menu>
</template>

<script>
import LangList from '~/components/lang_switcher/LangList'
export default {
  name: 'LangSwitcher',
  components: { LangList },
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
