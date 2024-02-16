<template>
  <v-navigation-drawer
    v-if="showSimilar"
    :model-value="true"
    :style="{ cursor: mini ? 'pointer' : 'auto' }"
    :permanent="!$vuetify.display.smAndDown"
    :temporary="$vuetify.display.smAndDown"
    touchless
    color="grey-lighten-4"
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
            {{ $t("common.hideSimilar") }}
          </div>
        </v-list-item>
      </v-list>
      <div v-else class="text-h6 py-2 pl-2">
        {{ $t("common.showSimilar") }}
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
          {{ $t("common.showSimilar") }}
        </div>
      </div>
      <div v-show="!mini">
        <slot name="drawer" :close-mobile-search="closeMobileSearch"></slot>
      </div>
    </div>
  </v-navigation-drawer>
  <v-main style="min-height: 100vh">
    <div class="fill-height pb-10">
      <slot name="title" />
      <slot />
      <fab-scroll-top />
    </div>
    <app-footer />
  </v-main>
</template>
<script setup lang="ts">
import { mdiChevronDoubleLeft } from "@mdi/js";

const props = defineProps({
  showSimilar: Boolean,
});

const showDrawer = ref(false);
const mini = ref(false);

function closeMobileSearch() {
  showDrawer.value = false;
}
</script>
