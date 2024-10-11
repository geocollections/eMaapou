<script setup lang="ts">
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import type { HydratedTab } from "~/composables/useTabs";

const props = defineProps<{
  tabs: HydratedTab[];
}>();

const localePath = useLocalePath();
const getRouteBaseName = useRouteBaseName();
const route = useRoute();
const tabsEl = ref();
const { t } = useI18n();

const currentTab = computed(() => {
  return props.tabs.find((tab) => {
    return tab.routeName === getRouteBaseName(route);
  }) ?? props.tabs[0]!;
});

function translateTitle(tab: HydratedTab) {
  if (tab.type === "static")
    return t(tab.title);

  if (tab.type === "dynamic")
    return t(tab.title, { number: tab.count });
}
</script>

<template>
  <div
    ref="tabsEl"
    class="tabs mt-1"
    height="32"
    slider-color="accent"
    show-arrows
  >
    <NuxtLink
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
    </NuxtLink>
  </div>
  <div v-else>
    <template #activator="{ props: menuProps, isActive }">
      <button
        class="text-capitalize mb-1 ml-auto"
        variant="outlined"
        height="32"
        color="accent"
        style="background-color: #fafafa"
        dark
        v-bind="menuProps"
        :append-icon="isActive ? mdiChevronUp : mdiChevronDown"
      >
        {{ translateTitle(currentTab) }}
      </button>
    </template>
    <ul>
      <li
        v-for="(item, index) in tabs"
        :key="index"
        :to="
          localePath({
            name: item.routeName,
            params: route.params,
          })
        "
      >
        <div>{{ translateTitle(item) }}</div>
      </li>
    </ul>
  </div>
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
