<script setup lang="ts">
import { mdiChevronDoubleLeft, mdiMagnify } from "@mdi/js";
import { useDisplay } from "vuetify";

const display = useDisplay();

const showSearch = ref(false);
watch(() => display.smAndDown.value, (value) => {
  if (value) {
    showSearch.value = true;
    return;
  }

  showSearch.value = value;
}, { immediate: true });

const mini = ref(false);

function closeMobileSearch() {
  showSearch.value = false;
}
</script>

<template>
  <div>
    <VNavigationDrawer
      :model-value="display.smAndDown.value ? showSearch : true"
      :style="{ cursor: mini ? 'pointer' : 'auto' }"
      :permanent="!display.smAndDown.value"
      :temporary="display.smAndDown.value"
      width="320"
      touchless
      color="grey-lighten-5"
      elevation="2"
      :rail="mini"
      :rail-width="48"
      :location="display.smAndDown.value ? 'bottom' : 'left'"
    >
      <div style="height: 100%" tile>
        <VList
          v-if="!display.smAndDown.value"
          density="compact"
          variant="plain"
          class="pa-0"
        >
          <VListItem :ripple="false" @click="mini = !mini">
            <template #prepend>
              <VIcon
                :icon="mdiChevronDoubleLeft"
                :style="{ transform: mini ? 'rotate(-180deg)' : 'none' }"
              />
            </template>
            <div class="montserrat font-weight-medium text--secondary">
              {{ $t("common.hideFilters") }}
            </div>
          </VListItem>
        </VList>
        <div v-else class="text-h6 py-2 pl-2">
          {{ $t("common.showSearchFields") }}
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
            {{ $t("common.showFilters") }}
          </div>
        </div>
        <div v-show="!mini">
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
          <VCol>
            <ClientOnly>
              <!-- <history-viewer v-if="$vuetify.display.smAndUp" /> -->
            </ClientOnly>
          </VCol>
        </VRow>
        <VRow no-gutters>
          <VCol class="bg-white">
            <slot name="title" />
          </VCol>
          <VCol cols="12">
            <slot name="result" />
          </VCol>
        </VRow>
        <VFabTransition v-if="display.smAndDown.value">
          <VBtn
            position="fixed"
            class="mb-2 text-capitalize"
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
  </div>
</template>
