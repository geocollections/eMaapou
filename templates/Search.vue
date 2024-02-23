<script setup lang="ts">
import { mdiChevronDoubleLeft, mdiMagnify } from "@mdi/js";

const showSearch = ref(false);
const mini = ref(false);

function closeMobileSearch() {
  showSearch.value = false;
}
</script>

<template>
  <div>
    <v-navigation-drawer
      :model-value="true"
      :style="{ cursor: mini ? 'pointer' : 'auto' }"
      :permanent="!$vuetify.display.smAndDown"
      :temporary="$vuetify.display.smAndDown"
      width="320"
      touchless
      color="grey-lighten-5"
      :rail="mini"
      :rail-width="48"
      :location="$vuetify.display.smAndDown ? 'bottom' : 'left'"
    >
      <div style="height: 100%" tile>
        <v-list
          v-if="!$vuetify.display.smAndDown"
          density="compact"
          variant="plain"
          class="pa-0"
        >
          <v-list-item :ripple="false" @click="mini = !mini">
            <template #prepend>
              <v-icon
                :icon="mdiChevronDoubleLeft"
                :style="{ transform: mini ? 'rotate(-180deg)' : 'none' }"
              />
            </template>
            <div class="montserrat font-weight-medium text--secondary">
              {{ $t("common.hideFilters") }}
            </div>
          </v-list-item>
        </v-list>
        <div v-else class="text-h6 py-2 pl-2">
          {{ $t("common.showSearchFields") }}
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
            {{ $t("common.showFilters") }}
          </div>
        </div>
        <div v-show="!mini">
          <slot name="form" :close-mobile-search="closeMobileSearch" />
        </div>
      </div>
    </v-navigation-drawer>
    <v-main>
      <v-container
        class="pt-1 pb-10 px-0"
        style="min-height: 100vh"
        :fluid="true"
      >
        <v-row no-gutters>
          <v-col>
            <client-only>
              <!-- <history-viewer v-if="$vuetify.display.smAndUp" /> -->
            </client-only>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="ml-2">
            <slot name="title" />
          </v-col>
          <v-col cols="12">
            <slot name="result" />
          </v-col>
        </v-row>
        <v-fab-transition v-if="$vuetify.display.smAndDown">
          <v-btn
            id="searchFab"
            class="mt-2 d-print-none d-md-none montserrat"
            color="warning"
            fixed
            rounded
            dark
            location="bottom"
            style="left: 50%; transform: translateX(-50%); z-index: 4"
            @click="showSearch = !showSearch"
          >
            <v-icon :icon="mdiMagnify" start />
            {{ $t("common.searchCommand") }}
          </v-btn>
        </v-fab-transition>
        <fab-scroll-top />
      </v-container>
      <app-footer />
    </v-main>
  </div>
</template>
