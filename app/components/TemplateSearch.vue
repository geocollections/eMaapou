<script setup lang="ts">
import { mdiChevronDoubleLeft, mdiMagnify } from "@mdi/js";

const drawer = ref(false);

const { mdAndUp } = useDisplay();
watchEffect(() => {
  if (mdAndUp)
    drawer.value = false;
});

const display = useDisplay();
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
  <div>
    <div
      :model-value="display.smAndDown.value ? showSearch : true"
      :style="{ cursor: mini ? 'pointer' : 'auto', maxHeight: display.smAndDown.value ? '70%' : 'none' }"
      :permanent="!display.smAndDown.value"
      mobile-breakpoint="md"
      width="300"
      color="grey-lighten-4"
      style="z-index:1004"
      :rail="mini"
      :location="display.smAndDown.value ? 'bottom' : 'left'"
      @update:model-value="showSearch = $event"
    >
      <div style="height: 100%" tile>
        <ul
          v-if="!display.smAndDown.value"
          density="compact"
          class="pb-1"
          nav
        >
          <li
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
              <div class="montserrat font-weight-medium ">
                {{ $t("common.hideFilters") }}
              </div>
            </template>
          </li>
        </ul>
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
    </div>
    <main>
      <div
        class="py-0 pb-10 px-0"
        style="min-height: 100vh"
        :fluid="true"
      >
        <div no-gutters>
          <div class="bg-white">
            <slot name="title" />
          </div>
          <div cols="12">
            <slot />
          </div>
        </div>
        <VFabTransition v-if="display.smAndDown.value">
          <button
            position="fixed"
            class="mb-2 text-capitalize"
            style="z-index: 1"
            location="bottom center"
            rounded
            color="warning"
            @click="showSearch = !showSearch"
          >
            <div :icon="mdiMagnify" start />
            {{ $t("common.searchCommand") }}
          </button>
        </VFabTransition>
        <!-- <FabScrollTop /> -->
      </div>
      <AppFooter />
    </main>
  </div>
</template>
