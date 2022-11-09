<template>
  <div>
    <v-row no-gutters>
      <v-col class="pt-md-5">
        <slot name="title"></slot>
        <v-row class="px-0 px-sm-3">
          <v-col v-if="!$vuetify.breakpoint.smAndDown" md="3">
            <v-card-title class="pl-2 py-1 montserrat">
              {{ $t('common.showSearch') }}
            </v-card-title>
            <slot name="form"></slot>
          </v-col>
          <v-col cols="12" md="9">
            <slot name="result"></slot>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="showSearch"
      temporary
      fixed
      bottom
    >
      <v-card color="grey lighten-5" tile class="pa-3">
        <v-card-title class="pl-2 py-1 montserrat">
          {{ $t('common.showSearch') }}
        </v-card-title>
        <slot name="form" :closeMobileSearch="closeMobileSearch"></slot>
      </v-card>
    </v-navigation-drawer>
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
  </div>
</template>
<script>
import { mdiMagnify } from '@mdi/js'
export default {
  // NOTE: Should probably named something more descriptive
  name: 'Search',
  data() {
    return {
      showSearch: false,
    }
  },
  computed: {
    icons() {
      return {
        mdiMagnify,
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
