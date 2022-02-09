<template>
  <v-app-bar app dark absolute clipped-right color="transparent" :elevation="0">
    <v-app-bar-title
      v-if="$vuetify.breakpoint.xsOnly"
      class="ml-3 align-self-center app-title"
    >
      <v-img
        :height="45"
        :width="90"
        contain
        :src="$img(logo, null, { provider: 'static' })"
      />
    </v-app-bar-title>
    <v-spacer />
    <v-toolbar-items>
      <language-switcher v-show="$vuetify.breakpoint.smAndUp" />
      <v-btn
        text
        class="montserrat"
        aria-label="Open navigation drawer"
        @click.stop="$emit('toggle:navigationDrawer')"
      >
        <div v-if="drawer">
          <span
            v-show="$vuetify.breakpoint.smAndUp"
            style="vertical-align: middle"
            >{{ $t('common.close') }}</span
          ><v-icon size="font-size: 24px">mdi-close</v-icon>
        </div>
        <div v-else>
          <span
            v-show="$vuetify.breakpoint.smAndUp"
            style="vertical-align: middle"
            >{{ $t('common.more') }}</span
          >
          <v-icon size="font-size: 24px">mdi-menu</v-icon>
        </div>
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import LanguageSwitcher from '~/components/language/LanguageSwitcher.vue'
export default {
  name: 'AppHeader',
  components: { LanguageSwitcher },
  props: {
    drawer: Boolean,
  },
  data() {
    return {
      logo: '/logos/emaapou5white.svg',
    }
  },
}
</script>

<style scoped lang="scss">
.app-title >>> .v-app-bar-title__content {
  width: unset !important;
}

.v-app-bar ::v-deep .v-toolbar__content {
  padding-right: 0;
  padding-left: 0;
}
</style>
