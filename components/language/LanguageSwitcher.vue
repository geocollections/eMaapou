<template>
  <v-btn
    id="lang_switch_btn"
    aria-label="select language"
    text
    class="montserrat text-capitalize"
    :color="color"
  >
    <v-icon left color="accent lighten-2">{{ icons.mdiWeb }}</v-icon>
    {{ $i18n.localeProperties.name }}
    <v-icon right color="accent lighten-2">{{ icons.mdiChevronDown }}</v-icon>
    <v-menu
      activator="#lang_switch_btn"
      content-class="elevation-2 mt-1"
      transition="slide-y-transition"
      offset-y
      bottom
      right
    >
      <language-list />
    </v-menu>
  </v-btn>
</template>

<script lang="ts">
import { mdiWeb, mdiChevronDown } from '@mdi/js'
import Vue from 'vue'
import LanguageList from '~/components/language/LanguageList.vue'
export default Vue.extend({
  name: 'LanguageSwitcher',
  components: { LanguageList },
  props: {
    color: {
      type: String,
      default: 'white',
    },
  },
  computed: {
    icons(): any {
      return {
        mdiWeb,
        mdiChevronDown,
      }
    },
  },
})
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
