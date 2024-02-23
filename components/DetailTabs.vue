<script setup lang="ts">
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import type { HydratedTab } from "~/composables/useTabs";

const props = defineProps({
  tabs: {
    type: Array as PropType<HydratedTab[]>,
    required: true,
  },
});

const localePath = useLocalePath();
const getRouteBaseName = useRouteBaseName();
const route = useRoute();
const tabsEl = ref();
const { t } = useI18n();

const currentTab = computed(() => {
  return props.tabs.find(tab => tab.routeName === getRouteBaseName());
});

function translateTitle(tab: HydratedTab) {
  if (tab.type === "static")
    return t(tab.title);

  if (tab.type === "dynamic")
    return t(tab.title, { number: tab.count });

  return tab.title;
}
</script>

<template>
  <v-tabs
    v-if="$vuetify.display.smAndUp"
    ref="tabsEl"
    class="tabs mt-1"
    height="32"
    slider-color="accent"
    show-arrows
  >
    <v-tab
      v-for="(item, index) in tabs"
      :key="index"
      class="montserrat tab text-none text-grey-darken-3 text-body-2"
      selected-class="v-tab--selected bg-grey-lighten-5 active-tab font-weight-medium border-s border-e border-t"
      exact
      :to="
        localePath({
          name: item.routeName,
          params: route.params,
        })
      "
    >
      {{ translateTitle(item) }}
    </v-tab>
  </v-tabs>
  <v-menu v-else>
    <template #activator="{ props, isActive }">
      <v-btn
        class="text-capitalize mb-1 ml-auto"
        variant="outlined"
        height="32"
        color="accent"
        style="background-color: #fafafa"
        dark
        v-bind="props"
        :append-icon="isActive ? mdiChevronUp : mdiChevronDown"
      >
        {{ translateTitle(currentTab) }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in tabs"
        :key="index"
        :to="
          localePath({
            name: item.routeName,
            params: route.params,
          })
        "
      >
        <v-list-item-title>{{ translateTitle(item) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style lang="scss" scoped>
.tabs {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  // &::after {
  //   content: '';
  //   width: 100%;
  //   height: 1px;
  //   background: black;
  //   display: inline-block;
  //   position: absolute;
  //   background-color: var(--v-accent-darken1);
  //   opacity: 0.2;
  // }
  // border-bottom: lightgray solid 1px;
}

.tab {
  border-top-left-radius: 4px !important;
  border-top-right-radius: 4px !important;
  &::after {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}

.active-tab {
  // font-weight: bold;
  color: rgb(var(--v-theme-accent-darken-3)) !important;

  &::after {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}

.v-tabs--vertical {
  .v-tabs-bar {
    .v-tab {
      height: 38px;
      font-size: 0.8125rem;
    }
  }
}
</style>
