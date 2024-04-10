<script setup lang="ts">
import { useDisplay } from "vuetify";
import { mdiChevronDoubleLeft, mdiChevronDoubleRight, mdiMagnify } from "@mdi/js";
import {
  BROWSE_GEOLOGY_LIST,
  BROWSE_LAB_LIST,
  BROWSE_TAXON_LIST,
  SERVICES,
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
const mini = ref(false);

const showSearch = ref(false);
watch(() => display.smAndDown.value, (value) => {
  if (!value)
    showSearch.value = false;
});
function closeMobileSearch() {
  showSearch.value = false;
}
</script>

<template>
  <VApp>
    <AppBar :drawer="drawer" @toggle:navigation-drawer="drawer = !drawer" />
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
    <VNavigationDrawer
      :model-value="display.smAndDown.value ? showSearch : true"
      :style="{ cursor: mini ? 'pointer' : 'auto' }"
      :permanent="!display.smAndDown.value"
      mobile-breakpoint="md"
      width="300"
      color="grey-lighten-4"
      style="z-index: 1000;"
      :rail="mini"
      :location="display.smAndDown.value ? 'bottom' : 'left'"
      @update:model-value="showSearch = $event"
    >
      <div style="height: 100%" tile>
        <VList
          v-if="!display.smAndDown.value"
          density="compact"
          class="pb-1"
          nav
        >
          <VListItem
            :ripple="false"
            slim
            @click="mini = !mini"
          >
            <template #prepend>
              <VIcon
                :icon="mdiChevronDoubleLeft"
                :style="{ transform: mini ? 'rotate(-180deg)' : 'none' }"
              />
            </template>
            <template #title>
              <div class="montserrat font-weight-medium ">
                {{ $t("common.hideFilters") }}
              </div>
            </template>
          </VListItem>
        </VList>
        <div v-else class="text-h6 py-2 pl-2">
          {{ $t("common.showSearchFields") }}
        </div>
        <div v-show="mini">
          <div
            class="montserrat font-weight-medium text-body-2 mt-2 ml-auto mr-auto"
            style="
              transform: scale(-1, -1);
              white-space: nowrap;
              writing-mode: vertical-lr;
            "
          >
            {{ $t("common.showFilters") }}
          </div>
        </div>
        <div v-show="!mini" class="mt-2">
          <slot name="form" :close-mobile-search="closeMobileSearch" />
        </div>
      </div>
    </VNavigationDrawer>
    <VMain>
      <VContainer
        class="py-0 pb-10 px-0"
        style="min-height: 100vh"
        :fluid="true"
      >
        <VRow no-gutters>
          <VCol class="bg-white">
            <slot name="title" />
          </VCol>
          <VCol cols="12">
            <slot />
          </VCol>
        </VRow>
        <VFabTransition v-if="display.smAndDown.value">
          <VBtn
            position="fixed"
            class="mb-2 text-capitalize"
            style="z-index: 1"
            location="bottom center"
            rounded
            color="warning"
            @click="showSearch = !showSearch"
          >
            <VIcon :icon="mdiMagnify" start />
            {{ $t("common.searchCommand") }}
          </VBtn>
        </VFabTransition>
        <FabScrollTop />
      </VContainer>
      <AppFooter />
    </VMain>
  </VApp>
</template>

<i18n lang="yaml">
et:
  closeSidebar: "Peida menüü"
en:
  closeSidebar: "Close menu"
</i18n>
