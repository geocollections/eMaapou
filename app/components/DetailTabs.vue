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
  <VTabs
    v-if="$vuetify.display.smAndUp"
    ref="tabsEl"
    class="tabs mt-1"
    height="32"
    slider-color="accent"
    show-arrows
  >
    <VTab
      v-for="(item, index) in tabs"
      :key="`tab-${index}`"
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
    </VTab>
  </VTabs>
  <VBtn
    v-else
    class="text-capitalize mb-1 ml-auto"
    variant="outlined"
    height="32"
    color="accent"
    style="background-color: #fafafa"
    dark
    :append-icon="mdiChevronDown"
  >
    {{ translateTitle(currentTab) }}
    <ClientOnly>
      <VMenu activator="parent">
        <VList>
          <VListItem
            v-for="(item, index) in tabs"
            :key="`menu-tab-${index}`"
            :to="
              localePath({
                name: item.routeName,
                params: route.params,
              })
            "
          >
            <VListItemTitle>{{ translateTitle(item) }}</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </ClientOnly>
  </VBtn>
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
