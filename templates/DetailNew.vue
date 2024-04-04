<script setup lang="ts">
import { mdiChevronDoubleLeft, mdiViewList } from "@mdi/js";
import { useDisplay } from "vuetify";

const props = defineProps({
  showSimilar: Boolean,
});

const display = useDisplay();

const showDrawer = ref(true);
watch([() => props.showSimilar, () => display.smAndDown.value], ([value, displayValue]) => {
  if (displayValue) {
    showDrawer.value = false;
    return;
  }

  showDrawer.value = value;
}, { immediate: true });

const mini = ref(false);

function closeMobileSearch() {
  showDrawer.value = false;
}

const topPadding = computed(() => display.mdAndUp.value ? 88 : 48);
</script>

<template>
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
</template>
