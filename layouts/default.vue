<template>
  <v-app dark>
    <v-img
      v-if="isLanding"
      height="400px"
      max-height="400px"
      width="100%"
      class="elevation-4"
      position="center 20%"
      :src="require('~/assets/frontpage/header_img.jpg')"
      :lazy-src="require('~/assets/frontpage/header_img_medium.jpg')"
    >
      <div
        class="mt-5 d-flex flex-column justify-center align-center fill-height"
      >
        <h1
          class="text-h3 font-weight-bold text-center my-3 montserrat white--text text-shadow"
        >
          {{ $t('landing.searchTitle') }}
        </h1>

        <quick-search-form
          class="mt-5"
          :class="{
            'form-sm-up': $vuetify.breakpoint.smAndUp,
            'form-lg-up': $vuetify.breakpoint.lgAndUp,
            'form-xs': $vuetify.breakpoint.xs,
          }"
          :only-icon="$vuetify.breakpoint.smAndDown"
          @submit="handleSearch"
        />
        <!-- <v-tabs
          :value="tabValue"
          align-with-title
          class="header-tabs flex-grow-0"
          style="position: absolute; bottom: 0"
          optional
          background-color="transparent"
          show-arrows
          center-active
          light
          centered
        >
          <v-tab
            v-for="(item, index) in tabs"
            :key="index"
            nuxt
            active-class="active-tab font-weight-bold"
            :to="localePath({ name: item.name })"
            class="montserrat white--text px-1"
          >
            <v-card class="pa-2" :class="`title-main`">

              {{ $t(`common.${item.lang}`) }}

            </v-card>
          </v-tab>
        </v-tabs> -->
      </div>
    </v-img>
    <app-header
      :is-detail="isDetail"
      :drawer="drawer"
      @toggle:navigationDrawer="drawer = !drawer"
    />
    <v-main :class="{ 'pt-0': isLanding }">
      <navigation-drawer
        :drawer="drawer"
        @update:navigationDrawer="drawer = $event"
      />
      <v-container
        :class="{ 'pt-0': !isLanding }"
        :fluid="$vuetify.breakpoint.lgAndDown"
      >
        <client-only>
          <history-viewer v-if="$vuetify.breakpoint.smAndUp && !isLanding" />
        </client-only>
        <nuxt />
        <scroll-top-fab class="fab-container fab-bottom-right ma-3" />
      </v-container>
      <client-only>
        <cookie-policy />
      </client-only>
    </v-main>

    <app-footer />
  </v-app>
</template>

<script>
import { isEmpty } from 'lodash'

import AppFooter from '@/components/AppFooter'
import AppHeader from '@/components/AppHeader'
import ScrollTopFab from '~/components/ScrollTopFab.vue'
import CookiePolicy from '~/components/CookiePolicy'
import HistoryViewer from '~/components/HistoryViewer.vue'
import NavigationDrawer from '~/components/NavigationDrawer'
import QuickSearchForm from '~/components/search/forms/QuickSearchForm'

export default {
  components: {
    NavigationDrawer,
    CookiePolicy,
    AppHeader,
    AppFooter,
    ScrollTopFab,
    HistoryViewer,
    QuickSearchForm,
  },
  data() {
    return {
      includeList: ['AnalysisSearch'],
      drawer: false,
      tabs: [
        {
          name: 'locality',
          lang: 'localities',
        },
        {
          name: 'site',
          lang: 'sites',
        },
        {
          name: 'drillcore',
          lang: 'drillcores',
        },
        {
          name: 'sample',
          lang: 'samples',
        },
        {
          name: 'analytical_data',
          lang: 'analyticalData',
        },
        { name: 'dataset', lang: 'datasets' },
        {
          name: 'taxon',
          lang: 'taxa',
        },
        { name: 'photo', lang: 'photo' },
      ],
    }
  },
  computed: {
    isDetail() {
      return this.getRouteBaseName().includes('-id')
    },
    isLanding() {
      return this.getRouteBaseName().startsWith('index')
    },
  },
  methods: {
    handleSearch() {
      const routeName = this.$route.name.includes('search')
        ? this.$route.name.split('__')[0]
        : 'search'
      const query = isEmpty(this.search)
        ? { ...this.$route.query }
        : { ...this.$route.query, q: this.search }
      this.$router.push(this.localePath({ name: routeName, query }))
    },
  },
}
</script>

<style lang="scss" scoped>
.fab-container {
  z-index: 1500;
  position: fixed;
}

.fab-bottom-right {
  bottom: 0;
  right: 0;
}

// .v-image ::v-deep .v-image__image {
//   background-position: center 40% !important;
// }

.form-xs {
  width: 85%;
}

.form-sm-up {
  width: 50%;
}

.form-lg-up {
  width: 33%;
}

.text-shadow {
  text-shadow: black 0 0 20px;
}

// .v-image ::v-deep .v-responsive__content {
//   align-self: center;
// }
</style>
