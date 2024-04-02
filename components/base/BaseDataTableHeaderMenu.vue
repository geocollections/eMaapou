<script setup lang="ts">
import { mdiEye, mdiEyeOff, mdiRefresh, mdiTableCog } from "@mdi/js";

const props = defineProps({
  headers: {
    type: Array,
    default: () => [],
  },
  visibleHeaders: {
    type: Array,
    default: () => [],
  },
  sortBy: {
    type: Array,
    default: () => [],
  },
});
const filter = ref("");
const onlyVisible = ref(false);

const filteredHeaders = computed(() => {
  if (onlyVisible.value) {
    return props.visibleHeaders.filter(header =>
      header.title.toLowerCase().includes(filter.value.toLowerCase()),
    );
  }
  return props.headers.filter(header =>
    header.title.toLowerCase().includes(filter.value.toLowerCase()),
  );
});
</script>

<template>
  <!-- NOTE: Using activator now for v-menu.
    Using the #id based implementation broke BaseDataTableHeaderMenu when switching between tabs.
    Right now the button does not appear immediately when page is loading.
    This is something to do with transitions. https://github.com/vuetifyjs/vuetify/issues/10578
  -->
  <VMenu
    transition="slide-y-transition"
    :offset="10"
    position="bottom"
    z-index="4"
    :close-on-content-click="false"
  >
    <template #activator="menu">
      <VTooltip location="bottom" open-delay="500">
        <template #activator="tooltip">
          <VBtn
            variant="text"
            :icon="mdiTableCog"
            v-bind="{ ...menu.props, ...tooltip.props }"
          />
        </template>
        <span>{{ $t("table.tooltipConfig") }}</span>
      </VTooltip>
    </template>
    <VCard>
      <VList flat>
        <VListItemTitle class="px-2 montserrat align-center">
          {{ $t("common.headers") }}
          <VTooltip location="bottom" open-delay="500">
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                :icon="mdiRefresh"
                variant="text"
                @click="$emit('reset')"
              />
            </template>
            {{ $t("table.tooltipResetHeaders") }}
          </VTooltip>

          <VTooltip open-delay="500" location="bottom">
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                variant="text"
                :icon="!onlyVisible ? mdiEye : mdiEyeOff"
                @click="onlyVisible = !onlyVisible"
              />
            </template>
            <span v-if="!onlyVisible">
              {{ $t("table.tooltipShowActiveHeaders") }}
            </span>
            <span v-else>{{ $t("table.tooltipShowAllHeaders") }}</span>
          </VTooltip>
          <VTextField
            v-model="filter"
            class="py-2"
            density="compact"
            variant="underlined"
            hide-details
            :label="$t('common.filter')"
          />
        </VListItemTitle>
        <VVirtualScroll
          :items="filteredHeaders"
          :height="500"
          :item-height="35"
          :width="300"
        >
          <template #default="{ item }">
            <VTooltip location="left" :disabled="!sortBy.includes(item.value)">
              <template #activator="{ props }">
                <VListItem
                  v-bind="props"
                  density="compact"
                  variant="text"
                  slim
                  :disabled="sortBy.includes(item.value)"
                  @click.prevent="$emit('change', item)"
                >
                  <template #prepend>
                    <VListItemAction start class="mr-2">
                      <VCheckboxBtn
                        density="compact"
                        :disabled="sortBy.includes(item.value)"
                        :model-value="item.show"
                        color="accent"
                      />
                    </VListItemAction>
                  </template>
                  <VListItemTitle>{{ item.title }}</VListItemTitle>
                </VListItem>
              </template>
              {{ $t("common.headerSelectDisabled") }}
            </VTooltip>
          </template>
        </VVirtualScroll>
      </VList>
    </VCard>
  </VMenu>
</template>
