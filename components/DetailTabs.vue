<template>
  <v-tabs
    ref="tabsEl"
    class="tabs"
    density="compact"
    :show-arrows="$vuetify.display.smAndUp"
    :direction="$vuetify.display.xs ? 'vertical' : 'horizontal'"
  >
    <v-tab
      v-for="(item, index) in tabs"
      :key="index"
      :disabled="item.count === 0"
      class="montserrat tab text-none"
      selected-class="active-tab font-weight-medium"
      exact
      :to="
        localePath({
          name: item.routeName,
          params: route.params,
        })
      "
      @click="handleTabChange"
      >{{ item.title }}</v-tab
    >
  </v-tabs>
  <slot :activeTabProps="activeTabProps" />
</template>

<script setup lang="ts">
import type { Tab } from "~/constants";

const props = defineProps({
  tabs: {
    type: Array as PropType<Tab[]>,
    required: true,
  },
});

const localePath = useLocalePath();
const getRouteBaseName = useRouteBaseName();
const route = useRoute();
const tabsEl = ref();

const tabsDict = ref(
  props.tabs.reduce(
    (prev, tab) => {
      return {
        ...prev,
        [tab.routeName]: tab,
      };
    },
    {} as { [K: string]: Tab },
  ),
);
const tabProps =
  getRouteBaseName(route) &&
  (getRouteBaseName(route) as string) in tabsDict.value
    ? tabsDict.value[getRouteBaseName(route) as string].props
    : props.tabs[0].props;

const activeTabProps = ref(tabProps);

watch(
  () => route.fullPath,
  () => {
    activeTabProps.value =
      tabsDict.value[getRouteBaseName(route) as string].props;
  },
);

function handleTabChange() {
  activeTabProps.value =
    tabsDict.value[getRouteBaseName(route) as string].props;
}
</script>

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
  color: #424242 !important;
  &::after {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}

.active-tab {
  // font-weight: bold;
  color: rgb(var(--v-theme-accent-darken-1)) !important;
  &::after {
    background-color: rgb(var(--v-theme-accent-darken-1)) !important;
    opacity: 0.2 !important;

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
