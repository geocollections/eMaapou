<script setup lang="ts">
import { mdiChevronDoubleLeft, mdiChevronDoubleRight } from "@mdi/js";
// import { useDisplay } from "vuetify";
import {
  BROWSE_GEOLOGY_LIST,
  BROWSE_LAB_LIST,
  BROWSE_TAXON_LIST,
} from "~/constants";

const display = useDisplay();
const drawer = ref(false);

const { mdAndUp } = useDisplay();
watchEffect(() => {
  if (mdAndUp)
    drawer.value = false;
});

const railDrawer = ref(true);
const localePath = useLocalePath();

const { t } = useI18n({ useScope: "local" });

const showDrawer = ref(false);
watch(() => display.smAndDown.value, (value) => {
  if (!value)
    showDrawer.value = false;
});
</script>

<template>
  <VApp>
    <AppBar @toggle:navigation-drawer="drawer = !drawer" />
    <AppDrawer
      v-if="!mdAndUp"
      :drawer="drawer"
      @update:navigation-drawer="drawer = $event"
    />
    <VNavigationDrawer
      v-else
      app
      :rail="railDrawer"
      color="grey-darken-3"
      style="z-index:1004"
      elevation="2"
      permanent
      :width="200"
    >
      <VList density="compact" nav>
        <VListItem
          :title="t('closeSidebar')"
          @click="railDrawer = !railDrawer"
        >
          <template #prepend>
            <VIcon v-if="railDrawer">
              {{ mdiChevronDoubleRight }}
            </VIcon>
            <VIcon v-else>
              {{ mdiChevronDoubleLeft }}
            </VIcon>
          </template>
        </VListItem>
        <VDivider class="mb-1" />
        <VListItem
          v-for="(item, index) in BROWSE_TAXON_LIST"
          :key="index"
          link
          color="accent-lighten-2"
          :to="localePath({ name: item.routeName })"
        >
          <template #prepend>
            <VIcon>{{ item.icon }}</VIcon>
          </template>
          <VListItemTitle>{{ $t(item.label) }}</VListItemTitle>
        </VListItem>
        <VDivider class="mb-1" />
        <VListItem
          v-for="(item, index) in BROWSE_LAB_LIST"
          :key="index"
          link
          color="accent-lighten-2"
          :to="localePath({ name: item.routeName })"
        >
          <template #prepend>
            <VIcon>{{ item.icon }}</VIcon>
          </template>
          <VListItemTitle>{{ $t(item.label) }}</VListItemTitle>
        </VListItem>
        <VDivider class="mb-1" />
        <VListItem
          v-for="(item, index) in BROWSE_GEOLOGY_LIST"
          :key="index"
          link
          color="accent-lighten-2"
          :to="localePath({ name: item.routeName })"
        >
          <template #prepend>
            <VIcon>{{ item.icon }}</VIcon>
          </template>
          <VListItemTitle>{{ $t(item.label) }}</VListItemTitle>
        </VListItem>
      </VList>
    </VNavigationDrawer>
    <slot />
  </VApp>
</template>

<i18n lang="yaml">
et:
  closeSidebar: "Peida menüü"
en:
  closeSidebar: "Close menu"
</i18n>
