<template>
  <v-app-bar app dark absolute clipped-right color="transparent" :elevation="0">
    <v-app-bar-title
      v-if="$vuetify.breakpoint.xsOnly"
      class="ml-3 align-self-center app-title"
    >
      <v-img
        v-if="$vuetify.breakpoint.xsOnly"
        :height="45"
        :width="90"
        contain
        :src="$img(logo, null, { provider: 'static' })"
      />
    </v-app-bar-title>
    <div v-else style="height: 40px; width: 80px" />
    <v-toolbar-items>
      <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp" class="ml-10">
        <v-menu
          content-class="elevation-2 mt-1"
          transition="slide-y-transition"
          offset-y
          bottom
          right
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              aria-label="browse"
              text
              class="montserrat"
              style="text-transform: capitalize; font-size: 0.875rem"
              v-on="on"
            >
              {{ $t('common.browse') }}
              <v-icon class="ml-1">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

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
                      <v-icon v-else style="height: 24px; width: 24px"></v-icon>
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
    <v-spacer v-if="$vuetify.breakpoint.mdAndUp" />
    <v-toolbar-items>
      <language-switcher v-show="$vuetify.breakpoint.smAndUp" />
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
    }
  },
}
</script>

<style scoped lang="scss">
.app-title >>> .v-app-bar-title__content {
  width: unset !important;
}
.v-app-bar ::v-deep .v-toolbar__content {
  max-width: 1785px;
  margin-left: auto;
  margin-right: auto;
  padding-right: 20px;
  padding-left: 20px;
}

.v-app-bar ::v-deep .v-toolbar__content {
  padding-right: 0;
  padding-left: 0;
}
</style>
