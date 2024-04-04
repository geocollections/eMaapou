<script setup lang="ts">
import { useDisplay } from "vuetify";
import { mdiChevronDoubleLeft, mdiChevronDoubleRight, mdiViewList } from "@mdi/js";
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

const showDrawer = ref(false);
watch(() => display.smAndDown.value, (value) => {
  if (!value)
    showDrawer.value = false;
});
function closeMobileSearch() {
  showDrawer.value = false;
}
const topPadding = computed(() => display.mdAndUp.value ? 88 : 48);

const { showSimilar } = useAttrs();
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
      v-if="showDrawer"
      :model-value="true"
      :style="{ cursor: mini ? 'pointer' : 'auto' }"
      :permanent="!$vuetify.display.smAndDown"
      mobile-breakpoint="md"
      color="grey-lighten-4"
      :rail="mini"
      :location="$vuetify.display.smAndDown ? 'bottom' : 'left'"
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
    <VMain style="min-height: 100vh " :style="{ 'padding-top': topPadding }">
      <div class="fill-height pb-10">
        <slot name="title" />
        <slot />
        <ClientOnly>
          <VFabTransition v-if="showSimilar && display.smAndDown.value">
            <VBtn
              position="fixed"
              class="mb-2 text-capitalize"
              location="bottom center"
              rounded
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
    <slot />
  </VApp>
</template>

<i18n lang="yaml">
et:
  closeSidebar: "Peida menüü"
en:
  closeSidebar: "Close menu"
</i18n>
