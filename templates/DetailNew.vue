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
    :temporary="$vuetify.display.smAndDown"
    touchless
    color="grey-lighten-5"
    elevation="2"
    :rail="mini"
    :rail-width="48"
    :location="$vuetify.display.smAndDown ? 'bottom' : 'left'"
  >
    <div style="height: 100%" tile>
      <VList
        v-if="!$vuetify.display.smAndDown"
        density="compact"
        variant="plain"
        class="pa-0"
      >
        <VListItem :ripple="false" @click="mini = !mini">
          <template #prepend>
            <VIcon :icon="mdiChevronDoubleLeft" :style="{ transform: mini ? 'rotate(-180deg)' : 'none' }" />
          </template>
          <div class="montserrat font-weight-medium text--secondary">
            {{ $t("common.hideSimilar") }}
          </div>
        </VListItem>
      </VList>
      <div v-else class="text-h6 py-2 pl-2">
        {{ $t("common.showSimilar") }}
      </div>
      <div v-show="mini">
        <div
          class="montserrat font-weight-medium text--secondary ml-auto mr-auto"
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
