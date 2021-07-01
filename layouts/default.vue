<template>
  <v-app dark>
    <v-img
      v-if="isLanding"
      :height="
        ($vuetify.breakpoint.xsOnly && $vuetify.breakpoint.height < 700) ||
        ($vuetify.breakpoint.smAndUp && $vuetify.breakpoint.height < 400)
          ? '700px'
          : '100vh'
      "
      :max-height="
        ($vuetify.breakpoint.xsOnly && $vuetify.breakpoint.height < 700) ||
        ($vuetify.breakpoint.smAndUp && $vuetify.breakpoint.height < 400)
          ? '700px'
          : '100vh'
      "
      width="100%"
      class="elevation-4 background-image"
      position="center 20%"
      :src="require('~/assets/frontpage/header_img.jpg')"
      :lazy-src="require('~/assets/frontpage/header_img_medium.jpg')"
    >
      <div
        class="d-flex flex-column align-sm-content-start align-sm-content-center"
        style="height: 100%; margin-top: 64px"
      >
        <v-row
          v-if="!$vuetify.breakpoint.xsOnly && $vuetify.breakpoint.height > 400"
          no-gutters
          align-content="end"
          class="mt-sm-2 flex-grow-0"
        >
          <v-col
            cols="10"
            sm="8"
            md="12"
            lg="12"
            offset-md="1"
            offset-sm="2"
            offset="1"
            class="mb-5"
          >
            <!-- <v-img
              dark
              :height="100"
              :width="200"
              contain
              :src="logo"
              class="mx-auto mt-5 mb-sm-5"
            /> -->
            <div
              class="d-flex flex-row align-center text-md-h3 text-sm-h4 white--text"
            >
              <img
                style="height: 100px; width: 200px"
                :src="logo"
                class="mt-5 mb-sm-5 mr-4"
              />
              <v-divider vertical class="white my-5" />
              <div class="ml-4 font-weight-bold">Kogu info Eesti maapõuest</div>
            </div>
          </v-col>
        </v-row>
        <v-row
          no-gutters
          align-content="center"
          align-content-sm="start"
          justify="center"
          justify-sm="start"
          class="mt-6 mt-sm-2 flex-grow-0 flex-sm-grow-1"
        >
          <v-col cols="11" sm="8" :md="5" :lg="4" offset-md="1" offset-sm="2">
            <v-card
              color="header darken-1"
              :height="
                $vuetify.breakpoint.xsOnly ||
                ($vuetify.breakpoint.smAndUp &&
                  $vuetify.breakpoint.height < 400)
                  ? 'auto'
                  : 'auto'
              "
              class="pt-5 pt-sm-0"
              outlines
              elevation="15"
            >
              <v-row no-gutters>
                <v-col>
                  <div class="d-flex flex-column justify-start fill-height">
                    <div class="my-4 my-sm-10 my-md-15">
                      <v-card-title
                        style="word-break: break-word"
                        :class="{
                          'font-small montserrat':
                            $vuetify.breakpoint.smAndDown,
                        }"
                        class="mx-3 mb-4 pa-0 px-sm-2 text-sm-h4 white--text"
                      >
                        {{ $t('landing.quickSearch') }}
                      </v-card-title>
                      <v-card-actions class="mx-3 mx-sm-5 pa-0">
                        <quick-search-form
                          style="width: 100%"
                          :only-icon="$vuetify.breakpoint.smAndDown"
                          @submit="handleSearch"
                        />
                      </v-card-actions>
                    </div>
                    <div v-if="renderMap" class="text-right">
                      <v-btn
                        :ripple="false"
                        plain
                        dark
                        class="montserrat py-6"
                        @click="showMap = !showMap"
                      >
                        {{
                          showMap ? $t('common.closeMap') : $t('common.openMap')
                        }}

                        <v-icon>{{
                          showMap ? 'mdi-chevron-left' : 'mdi-chevron-right'
                        }}</v-icon>
                      </v-btn>
                    </div>

                    <v-divider class="white mx-2 mx-sm-5"></v-divider>

                    <div class="my-4 my-sm-10 my-md-15">
                      <v-card-title
                        style="word-break: break-word"
                        :class="{
                          'font-small montserrat':
                            $vuetify.breakpoint.smAndDown,
                        }"
                        class="mx-3 mb-4 pa-0 px-sm-2 text-sm-h4 white--text"
                      >
                        {{ $t('landing.viewMore') }}
                      </v-card-title>
                      <div class="mx-3 mx-sm-5 mt-2 d-flex flex-wrap">
                        <div
                          v-for="(item, index) in tabs"
                          :key="`tab-mobile-${index}`"
                          class="px-1 pb-2 montserrat white--text"
                        >
                          <search-card
                            class="text--h6"
                            height="50px"
                            :title="item.title"
                            :card-class="item.class"
                            :to="localePath({ name: item.localeName })"
                          ></search-card>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-slide-x-transition mode="in-out">
            <v-col v-show="renderMap && showMap" md="5" lg="6" class="pa-0">
              <leaflet-map
                class="ml-4 elevation-3"
                height="70vh"
                summary-overlay
                :invalidate-size="showMap"
                :zoom="6"
                rounded
                :show-links="false"
                :gesture-handling="false"
              />
            </v-col>
          </v-slide-x-transition>
        </v-row>
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
import SearchCard from '~/components/SearchCard.vue'
import LeafletMap from '~/components/map/LeafletMap.vue'

export default {
  components: {
    NavigationDrawer,
    CookiePolicy,
    AppHeader,
    AppFooter,
    ScrollTopFab,
    HistoryViewer,
    QuickSearchForm,
    SearchCard,
    LeafletMap,
  },
  data() {
    return {
      includeList: ['AnalysisSearch'],
      logo: require('~/assets/logos/emaapou5white.svg'),
      drawer: false,
      showMap: false,
      tabs: [
        {
          localeName: 'locality',
          title: this.$t('common.localities'),
          class: 'locality-search-card',
        },
        {
          localeName: 'site',
          title: this.$t('common.sites'),
          class: 'site-search-card',
        },
        {
          localeName: 'drillcore',
          title: this.$t('common.drillcores'),
          class: 'drillcore-search-card',
        },
        {
          localeName: 'sample',
          title: this.$t('common.samples'),
          class: 'sample-search-card',
        },
        {
          localeName: 'analytical-data',
          title: this.$t('common.analyticalData'),
          class: 'analysis-search-card',
        },
        {
          localeName: 'dataset',
          title: this.$t('common.datasets'),
          class: 'dataset-search-card',
        },
        {
          localeName: 'taxon',
          title: this.$t('common.taxa'),
          class: 'search-card',
        },
        {
          localeName: 'photo',
          title: this.$t('common.photo'),
          class: 'photo-search-card',
        },
        {
          localeName: 'analysis',
          title: this.$t('common.analyses'),
          class: 'analysis-search-card',
        },
        {
          localeName: 'stratigraphy',
          title: this.$t('common.stratigraphy'),
          class: 'stratigraphy-search-card',
        },
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
    renderMap() {
      return this.$vuetify.breakpoint.mdAndUp
    },
  },
  watch: {
    '$vuetify.breakpoint.mdAndUp'(newVal, oldVal) {
      if (newVal === false) this.showMap = false
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
.background-image ::v-deep > .v-image__image {
  filter: brightness(0.6) !important;
}

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

.font-small {
  font-size: 1.7rem;
}

.quick-search-card {
  border-left-width: 5px !important;
  border-left-style: solid !important;
  border-left-color: var(--v-accent-base) !important;
}

// .v-image ::v-deep .v-responsive__content {
//   align-self: center;
// }
</style>
