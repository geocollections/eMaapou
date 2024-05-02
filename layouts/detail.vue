<script setup lang="ts">
import { useDisplay } from "vuetify";
import { mdiChevronDoubleLeft, mdiChevronDoubleRight, mdiViewList } from "@mdi/js";
import {
  BROWSE_GEOLOGY_LIST,
  BROWSE_LAB_LIST,
  BROWSE_TAXON_LIST,
} from "~/constants";

const layoutCustomProps = useAttrs();

const display = useDisplay();
const drawer = ref(false);

watchEffect(() => {
  if (display.mdAndUp.value)
    drawer.value = false;
});

const railDrawer = ref(true);
const localePath = useLocalePath();

const { t } = useI18n({ useScope: "local" });

const mini = ref(false);

const drawerActive = ref(layoutCustomProps["show-similar"] as boolean ?? false);

const showDrawer = ref(true);
watch([() => layoutCustomProps["show-similar"], () => display.smAndDown.value], ([value, displayValue]) => {
  drawerActive.value = value;
  if (displayValue) {
    showDrawer.value = false;
    return;
  }
  showDrawer.value = value;
}, { immediate: true });
function closeMobileSearch() {
  showDrawer.value = false;
}
const topPadding = computed(() => display.mdAndUp.value ? 88 : 48);

const { mdAndUp } = useDisplay();
</script>

<template>
  <VApp>
    <AppBar :drawer="drawer" @toggle:navigation-drawer="drawer = !drawer" />
    <AppDrawer
      :drawer="drawer"
      @update:navigation-drawer="drawer = $event"
    />
    <VNavigationDrawer
      :model-value="mdAndUp"
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
    <ClientOnly>
      <VNavigationDrawer
        v-if="drawerActive"
        :model-value="showDrawer"
        :style="{ cursor: mini ? 'pointer' : 'auto' }"
        :permanent="!$vuetify.display.smAndDown"
        mobile-breakpoint="md"
        color="grey-lighten-4"
        :rail="mini"
        :location="$vuetify.display.smAndDown ? 'bottom' : 'left'"
        @update:model-value="showDrawer = $event"
      >
        <div style="height: 100%" tile>
          <VList
            v-if="!$vuetify.display.smAndDown"
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
                <div class="montserrat font-weight-medium">
                  {{ $t("common.hideSimilar") }}
                </div>
              </template>
            </VListItem>
          </VList>
          <div v-else class="text-h6 py-2 pl-2">
            {{ $t("common.showSimilar") }}
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
              {{ $t("common.showSimilar") }}
            </div>
          </div>
          <div v-show="!mini">
            <slot name="drawer" :close-mobile-search="closeMobileSearch" />
          </div>
        </div>
      </VNavigationDrawer>
    </ClientOnly>
    <VMain style="min-height: 100vh " :style="{ 'padding-top': topPadding }">
      <div class="fill-height pb-10">
        <slot name="title" />
        <slot />
        <ClientOnly>
          <VFabTransition v-if="$attrs['show-similar'] && display.smAndDown.value">
            <VBtn
              position="fixed"
              class="mb-2 text-capitalize"
              location="bottom center"
              rounded
              style="z-index: 1000"
              color="warning"
              @click="showDrawer = !showDrawer"
            >
              <VIcon :icon="mdiViewList" start />
              {{ $t("common.similar") }}
            </VBtn>
          </VFabTransition>
        </ClientOnly>
        <FabScrollTop />
      </div>
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
