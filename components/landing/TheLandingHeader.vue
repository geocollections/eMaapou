<template>
  <v-hover v-slot="{ hover }">
    <v-app-bar
      app
      dark
      absolute
      clipped-right
      :color="hover ? 'tertiary' : 'transparent'"
      :class="{
        'app-bar-full': $vuetify.breakpoint.mdAndUp,
        'app-bar-mobile': !$vuetify.breakpoint.mdAndUp,
      }"
      :elevation="0"
    >
      <v-toolbar-title class="align-self-center">
        <!--
          NOTE: Tooltip is implemented with activator prop so that it does not disappear before chaning routes.
          Using v-slot:activator added a transition that made the title disappear when clicked.
          https://github.com/vuetifyjs/vuetify/issues/10578 comment by eduardo76 Nov 9, 2020
         -->
        <nuxt-link id="app-bar-title" :to="localePath({ path: '/' })">
          <v-img
            v-if="$vuetify.breakpoint.mdAndUp"
            :height="40"
            :width="80"
            contain
            :src="$img(logo, null, { provider: 'static' })"
          />
          <v-img
            v-if="!$vuetify.breakpoint.mdAndUp"
            :height="36"
            :width="36"
            contain
            :src="$img(logoCompact, null, { provider: 'static' })"
          />
          <v-tooltip bottom activator="#app-bar-title">
            <span>{{ $t('landing.goToFrontpage') }}</span>
          </v-tooltip>
        </nuxt-link>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp" class="ml-10">
          <v-btn
            id="browse_menu_btn"
            aria-label="browse"
            text
            class="montserrat"
            style="text-transform: capitalize; font-size: 0.875rem"
          >
            {{ $t('common.browse') }}
            <v-icon class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
          <v-menu
            activator="#browse_menu_btn"
            content-class="elevation-2 mt-1"
            transition="slide-y-transition"
            offset-y
            bottom
            right
            attach=""
          >
            <v-card width="550">
              <v-card-actions class="d-block">
                <div
                  v-for="(tab, index) in tabsAll"
                  :key="`browse-${index}`"
                  class="d-inline-block"
                >
                  <v-hover v-slot="{ hover }">
                    <v-card
                      elevation="0"
                      nuxt
                      class="align-center ma-1 px-2 py-3"
                      :class="{ 'on-hover': hover }"
                      active-class="active-card"
                      width="250"
                      :to="localePath({ name: tab.routeName })"
                    >
                      <div
                        class="
                          font-weight-medium
                          text-button
                          d-flex
                          ml-2
                          align-center
                        "
                        style="text-transform: capitalize !important"
                      >
                        <v-icon v-if="tab.icon">{{ tab.icon }}</v-icon>
                        <v-icon
                          v-else
                          style="height: 24px; width: 24px"
                        ></v-icon>
                        <div class="ml-3 montserrat tab" style="">
                          {{ $t(tab.text) }}
                        </div>
                        <v-icon v-show="hover" class="ml-auto mr-2">
                          mdi-arrow-right
                        </v-icon>
                      </div>
                    </v-card>
                  </v-hover>
                </div>
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-btn
            nuxt
            aria-label="about page"
            text
            class="montserrat"
            style="text-transform: capitalize"
            :to="localePath({ name: 'about' })"
          >
            {{ $t('common.about') }}
          </v-btn>

          <v-btn
            nuxt
            aria-label="news page"
            text
            class="montserrat"
            style="text-transform: capitalize"
            :to="localePath({ name: 'news' })"
          >
            {{ $t('common.news') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
        <language-switcher v-show="$vuetify.breakpoint.smAndUp" />
        <v-btn
          v-if="!$vuetify.breakpoint.mdAndUp"
          text
          class="montserrat"
          aria-label="Open navigation drawer"
          style="text-transform: capitalize"
          @click.stop="$emit('toggle:navigationDrawer')"
        >
          <v-icon size="font-size: 24px">mdi-menu</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </v-hover>
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
      tabsAll: [
        {
          routeName: 'locality',
          text: 'locality.pageTitle',
          icon: 'mdi-map-marker-outline',
        },
        {
          routeName: 'site',
          text: 'site.pageTitle',
          icon: 'mdi-binoculars',
        },
        {
          routeName: 'drillcore',
          text: 'drillcore.pageTitle',
          icon: 'mdi-screw-machine-flat-top',
        },
        {
          routeName: 'sample',
          text: 'sample.pageTitle',
          icon: 'mdi-test-tube',
        },
        {
          routeName: 'analysis',
          text: 'analysis.pageTitle',
          icon: 'mdi-chart-scatter-plot',
        },
        {
          routeName: 'analytical-data',
          text: 'analyticalData.pageTitle',
          icon: 'mdi-chart-line',
        },
        {
          routeName: 'dataset',
          text: 'dataset.pageTitle',
          icon: 'mdi-database-outline',
        },
        {
          routeName: 'taxon',
          text: 'taxon.pageTitle',
          icon: 'mdi-family-tree',
        },
        // {
        //   name: 'file',
        //   lang: 'attachments',
        //   icon: 'mdi-folder-open-outline',
        // },
        {
          routeName: 'stratigraphy',
          text: 'stratigraphy.pageTitle',
          icon: 'mdi-layers-triple',
        },
        {
          routeName: 'photo',
          text: 'photo.pageTitle',
          icon: 'mdi-file-image-outline',
        },
        {
          routeName: 'specimen',
          text: 'specimen.pageTitle',
          icon: 'mdi-microscope',
        },
        { routeName: 'preparation', text: 'preparation.pageTitle' },
        { routeName: 'area', text: 'area.pageTitle' },
      ],
      logo: '/logos/emaapou5white.svg',
      logoCompact: '/logos/emaapou_short.svg',
    }
  },
}
</script>

<style scoped lang="scss">
.app-bar-mobile ::v-deep .v-toolbar__content {
  max-width: 1785px;
  margin-left: auto;
  margin-right: auto;
  padding-right: 0px;
  // padding-left: 20px;
}

.app-bar-full ::v-deep .v-toolbar__content {
  max-width: 1785px;
  margin-left: auto;
  margin-right: auto;
  // padding-right: 0px;
  // padding-left: 20px;
  // border-bottom: map-get($map: $grey, $key: 'lighten-2') solid 1px !important;
}
</style>
