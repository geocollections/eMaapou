<script setup lang="ts">
import { mdiChevronDoubleLeft, mdiViewList } from "@mdi/js";

const props = withDefaults(defineProps<{
  showSimilar?: boolean;
}>(), { showSimilar: false });

const display = useDisplay();
const drawer = ref(false);

watchEffect(() => {
  if (display.mdAndUp.value)
    drawer.value = false;
});

const mini = ref(false);
const drawerActive = ref(props.showSimilar);

const showDrawer = ref(true);
watch([() => props.showSimilar, () => display.smAndDown.value], ([value, displayValue]) => {
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
</script>

<template>
  <div>
    <ClientOnly>
      <VNavigationDrawer
        v-if="drawerActive"
        :model-value="showDrawer"
        :style="{ cursor: mini ? 'pointer' : 'auto', maxHeight: display.smAndDown.value ? '70%' : 'none' }"
        mobile-breakpoint="md"
        color="grey-lighten-4"
        :rail="mini"
        @update:model-value="showDrawer = $event"
      >
        <div style="height: 100%" tile>
          <VList
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
                <div
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
          <div
            v-show="!mini && !display.smAndDown.value"
            id="divider"
            class="mx-2"
          />
          <div v-show="!mini">
            <slot name="drawer" :close-mobile-search="closeMobileSearch" />
          </div>
        </div>
      </VNavigationDrawer>
    </ClientOnly>
    <main :style="{ 'padding-top': topPadding }">
      <div class="fill-height pb-10" style="min-height: 100vh">
        <slot name="title" />
        <slot />
        <ClientOnly>
          <VFabTransition v-if="showSimilar && display.smAndDown.value">
            <button
              position="fixed"
              class="mb-2 text-capitalize"
              location="bottom center"
              rounded
              style="z-index: 1000"
              color="warning"
              @click="showDrawer = !showDrawer"
            >
              <div :icon="mdiViewList" start />
              <slot name="mobileDrawerFabContent">
                {{ $t("common.similar") }}
              </slot>
            </button>
          </VFabTransition>
        </ClientOnly>
        <!-- <FabScrollTop /> -->
      </div>
      <AppFooter />
    </main>
  </div>
</template>
