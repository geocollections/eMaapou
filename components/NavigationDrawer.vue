<template>
  <v-navigation-drawer
    :value="drawer"
    app
    right
    temporary
    width="100%"
    class="elevation-4"
    :height="$vuetify.breakpoint.smAndUp ? 'unset' : `100%`"
    :style="`z-index: 2050; margin-top: ${$vuetify.application.top}px; opacity: 0.95`"
    :class="{ 'use-padding-bottom': $vuetify.breakpoint.smAndDown }"
    @input="$emit('update:navigationDrawer', $event)"
  >
    <v-container class="more-menu py-4 mb-6">
      <v-row>
        <v-col cols="12" sm="4" class="px-4 py-0">
          <div class="section-title">
            {{ $t('landing.routes') }}
          </div>

          <hr />

          <div class="d-flex flex-column align-start">
            <nuxt-link
              v-for="item in routes"
              :key="item.name"
              :to="localePath({ name: item.name })"
              class="mb-1 menu-link"
              exact
              exact-active-class="menu-link-active"
              ><v-icon v-if="item.icon" small left>{{ item.icon }}</v-icon>
              {{ $t(`common.${item.lang}`) }}
            </nuxt-link>
          </div>
        </v-col>

        <v-col cols="12" sm="4" class="px-4 py-0">
          <div class="section-title">{{ $t('common.links') }}</div>

          <hr />

          <div class="d-flex flex-column align-start">
            <a
              v-for="item in links"
              :key="item.name"
              :href="item.url"
              class="mb-1 menu-link"
            >
              <v-icon v-if="item.icon" small left>{{ item.icon }}</v-icon>
              {{ $t(item.name) }}
            </a>
          </div>
        </v-col>

        <v-col cols="12" sm="4" class="px-4 py-0">
          <div class="section-title">{{ $t('common.links') }}</div>

          <hr />

          <div class="d-flex flex-column align-start">
            <a
              v-for="item in links"
              :key="item.name"
              :href="item.url"
              class="mb-1 menu-link"
            >
              <v-icon v-if="item.icon" small left>{{ item.icon }}</v-icon>
              {{ $t(item.name) }}
            </a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'NavigationDrawer',
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      routes: [
        {
          name: 'about',
          lang: 'about',
          icon: 'mdi-information-outline',
        },
        {
          name: 'search',
          lang: 'search',
          icon: 'mdi-magnify',
        },
        {
          name: 'drillcore',
          lang: 'drillcores',
          icon: 'mdi-screw-machine-flat-top',
        },
        {
          name: 'locality',
          lang: 'localities',
          icon: 'mdi-map-marker-outline',
        },
        {
          name: 'sample',
          lang: 'samples',
          icon: 'mdi-test-tube',
        },
        {
          name: 'analysis',
          lang: 'analyses',
          icon: 'mdi-chart-scatter-plot',
        },
        {
          name: 'site',
          lang: 'sites',
          icon: 'mdi-binoculars',
        },
        {
          name: 'file',
          lang: 'attachments',
          icon: 'mdi-folder-open-outline',
        },
        {
          name: 'stratigraphy',
          lang: 'stratigraphy',
          icon: '',
        },
      ],
      links: [
        { name: 'link.geokogud', url: 'https://geocollections.info' },
        { name: 'link.geokirjandus', url: 'https://geocollections.info' },
        { name: 'link.sarvDOI', url: 'https://doi.geocollections.info/' },
        { name: 'link.fossils', url: 'https://fossiilid.info/' },
        { name: 'link.turvas', url: 'https://turba.geoloogia.info' },
        { name: 'link.chitinozoa', url: 'https://chitinozoa.net/' },
        { name: 'link.eurocore', url: 'https://eurocore.rocks/' },
        { name: 'link.sarvAPI', url: 'https://api.geocollections.info' },
        { name: 'link.github', url: 'https://github.com/geocollections/' },
      ],
    }
  },
}
</script>

<style scoped>
.more-menu .section-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-top: 24px;
  text-transform: uppercase;
}
.more-menu hr {
  border: 0;
  border-top: 2px solid #959595;
  margin: 16px 0;
  opacity: 0.2;
}

.use-padding-bottom {
  padding-bottom: 56px;
}
</style>
