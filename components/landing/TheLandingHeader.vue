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
            :height="40"
            :width="80"
            contain
            :src="$img(logo, null, { provider: 'static' })"
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
            <v-card max-width="1000">
              <v-card-actions class="d-flex align-baseline">
                <v-list class="mx-3" width="250">
                  <base-menu-list-item
                    v-for="(item, index) in browseGeography"
                    :key="`browse-geography-item-${index}`"
                    class="my-1"
                    :icon="item.icon"
                    :label="$t(item.label)"
                    nuxt
                    :to="localePath({ name: item.routeName })"
                  />
                </v-list>

                <!-- <v-divider class="mx-3" vertical /> -->
                <v-list class="mx-3" width="250">
                  <base-menu-list-item
                    v-for="(item, index) in browseLab"
                    :key="`browse-lab-item-${index}`"
                    class="my-1"
                    :icon="item.icon"
                    :label="$t(item.label)"
                    nuxt
                    :to="localePath({ name: item.routeName })"
                  />
                </v-list>
                <!-- <v-divider class="mx-3" vertical /> -->
                <v-list class="mx-3" width="250">
                  <base-menu-list-item
                    v-for="(item, index) in browseTaxon"
                    :key="`browse-lab-item-${index}`"
                    class="my-1"
                    :icon="item.icon"
                    :label="$t(item.label)"
                    nuxt
                    :to="localePath({ name: item.routeName })"
                  />
                </v-list>
              </v-card-actions>
              <v-divider class="mx-5 mt-3" />
              <v-card-actions>
                <v-list class="mx-3" width="250">
                  <base-menu-list-item
                    class="my-1"
                    icon="mdi-file-image-outline"
                    :label="$t('photo.pageTitle')"
                    nuxt
                    :to="localePath({ name: 'photo' })"
                  />
                </v-list>
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
import {
  BROWSE_GEOLOGY_LIST,
  BROWSE_LAB_LIST,
  BROWSE_TAXON_LIST,
} from '~/constants'
export default {
  name: 'AppHeader',
  components: { LanguageSwitcher },
  props: {
    drawer: Boolean,
  },
  data() {
    return {
      browseGeography: BROWSE_GEOLOGY_LIST,
      browseLab: BROWSE_LAB_LIST,
      browseTaxon: BROWSE_TAXON_LIST,
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
