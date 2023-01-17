<template>
  <div>
    <v-navigation-drawer
      v-model="showSearch"
      :style="{ cursor: mini ? 'pointer' : 'auto' }"
      :permanent="!$vuetify.breakpoint.smAndDown"
      :temporary="$vuetify.breakpoint.smAndDown"
      :fixed="$vuetify.breakpoint.smAndDown"
      width="320"
      clipped
      app
      :mini-variant.sync="mini"
      :mini-variant-width="48"
      :bottom="$vuetify.breakpoint.smAndDown"
    >
      <v-card style="height: 100%" color="grey lighten-5" tile>
        <v-list v-if="!$vuetify.breakpoint.smAndDown" dense flat class="pa-0">
          <v-list-item :ripple="false" @click="mini = !mini">
            <v-list-item-icon :class="{ 'mr-3': !mini }">
              <v-icon :style="{ transform: mini ? 'rotate(-180deg)' : 'none' }">
                {{ icons.mdiChevronDoubleLeft }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content
              class="montserrat font-weight-medium text--secondary"
            >
              {{ $t('common.hideFilters') }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div v-else class="text-h6 py-2 pl-2">
          {{ $t('common.showSearchFields') }}
        </div>
        <div v-show="mini">
          <div
            class="montserrat font-weight-medium text--secondary ml-auto mr-auto"
            style="
              transform: scale(-1, -1);
              white-space: nowrap;
              writing-mode: vertical-lr;
            "
          >
            {{ $t('common.showFilters') }}
          </div>
        </div>
        <div v-show="!mini">
          <slot name="form" :close-mobile-search="closeMobileSearch"></slot>
        </div>
      </v-card>
    </v-navigation-drawer>
    <v-main>
      <v-container
        class="pt-1 pb-10"
        style="min-height: 100vh"
        :fluid="$vuetify.breakpoint.lgAndDown"
      >
        <v-row no-gutters>
          <v-col>
            <client-only>
              <history-viewer v-if="$vuetify.breakpoint.smAndUp" />
            </client-only>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="pt-md-5">
            <slot name="title"></slot>
            <v-row class="px-0 px-sm-3">
              <!-- <v-col v-if="!$vuetify.breakpoint.smAndDown" md="3">
            <v-card-title class="pl-2 py-1 montserrat">
              {{ $t('common.showSearch') }}
            </v-card-title>
            <slot name="form"></slot>
          </v-col> -->
              <v-col cols="12">
                <slot name="result"></slot>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-fab-transition v-if="$vuetify.breakpoint.smAndDown">
          <v-btn
            id="searchFab"
            class="mt-2 d-print-none d-md-none montserrat"
            color="warning"
            fixed
            rounded
            dark
            bottom
            style="left: 50%; transform: translateX(-50%); z-index: 4"
            @click="showSearch = !showSearch"
          >
            <v-icon left>{{ icons.mdiMagnify }}</v-icon>
            {{ $t('common.searchCommand') }}
          </v-btn>
        </v-fab-transition>
        <fab-scroll-top />
      </v-container>
      <app-footer />
    </v-main>
  </div>
</template>
<script>
import { mdiChevronDoubleLeft, mdiMagnify } from '@mdi/js'
import FabScrollTop from '~/components/FabScrollTop.vue'
import AppFooter from '~/components/AppFooter.vue'
// import cookieconsent from '~/components/cookieconsent.vue'
import HistoryViewer from '~/components/HistoryViewer.vue'
export default {
  // NOTE: Should probably named something more descriptive
  name: 'Search',
  components: {
    FabScrollTop,
    AppFooter,
    // CookieConsent,
    HistoryViewer,
  },
  data() {
    return {
      showSearch: false,
      mini: false,
    }
  },
  computed: {
    icons() {
      return {
        mdiMagnify,
        mdiChevronDoubleLeft,
      }
    },
  },
  methods: {
    closeMobileSearch() {
      this.showSearch = false
    },
  },
}
</script>
