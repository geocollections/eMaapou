<template>
  <!-- NOTE: Using activator now for v-menu.
    Using the #id based implementation broke BaseDataTableHeaderMenu when switching between tabs.
    Right now the button does not appear immediately when page is loading.
    This is something to do with transitions. https://github.com/vuetifyjs/vuetify/issues/10578
  -->
  <v-menu
    transition="slide-y-transition"
    :offset="10"
    position="bottom"
    z-index="4"
    :close-on-content-click="false"
  >
    <template #activator="menu">
      <v-tooltip bottom open-delay="500">
        <template #activator="tooltip">
          <v-btn
            variant="text"
            :icon="mdiTableCog"
            v-bind="{ ...menu.props, ...tooltip.props }"
          >
          </v-btn>
        </template>
        <span>{{ $t("table.tooltipConfig") }}</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-list flat>
        <v-list-item-title class="px-2 montserrat align-center">
          {{ $t("common.headers") }}
          <v-tooltip bottom open-delay="500">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                :icon="mdiRefresh"
                variant="text"
                @click="$emit('reset')"
              >
              </v-btn>
            </template>
            {{ $t("table.tooltipResetHeaders") }}
          </v-tooltip>

          <v-tooltip open-delay="500" bottom>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                :icon="!onlyVisible ? mdiEye : mdiEyeOff"
                @click="onlyVisible = !onlyVisible"
              >
              </v-btn>
            </template>
            <span v-if="!onlyVisible">
              {{ $t("table.tooltipShowActiveHeaders") }}
            </span>
            <span v-else>{{ $t("table.tooltipShowAllHeaders") }}</span>
          </v-tooltip>
          <v-text-field
            v-model="filter"
            class="py-2"
            density="compact"
            variant="underlined"
            hide-details
            :label="$t('common.filter')"
          />
        </v-list-item-title>
        <v-virtual-scroll
          :items="filteredHeaders"
          :height="500"
          :item-height="35"
          :width="300"
        >
          <template #default="{ item }">
            <v-tooltip left :disabled="!sortBy.includes(item.value)">
              <template #activator="{ props }">
                <v-list-item
                  v-bind="props"
                  density="compact"
                  variant="text"
                  :disabled="sortBy.includes(item.value)"
                  @click="$emit('change', item)"
                >
                  <template #prepend>
                    <v-list-item-action start class="mr-2">
                      <v-checkbox-btn
                        density="compact"
                        :disabled="sortBy.includes(item.value)"
                        :model-value="item.show"
                        color="accent-lighten-2"
                      />
                    </v-list-item-action>
                  </template>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </template>
              {{ $t("common.headerSelectDisabled") }}
            </v-tooltip>
          </template>
        </v-virtual-scroll>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { mdiTableCog, mdiRefresh, mdiEye, mdiEyeOff } from "@mdi/js";

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
    return props.visibleHeaders.filter((header) =>
      header.title.toLowerCase().includes(filter.value.toLowerCase())
    );
  }
  return props.headers.filter((header) =>
    header.title.toLowerCase().includes(filter.value.toLowerCase())
  );
});
</script>
