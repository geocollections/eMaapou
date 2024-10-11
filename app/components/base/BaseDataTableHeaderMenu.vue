<script setup lang="ts">
import { mdiEye, mdiEyeOff, mdiRefresh, mdiTableCog } from "@mdi/js";

const props = defineProps<
  {
    headers: Header[];
    visibleHeaders: Header[];
    sortBy: SortItem[];
  }
>();

const emit = defineEmits<{
  change: [header: Header];
  reset: [];
}>();

const filter = ref("");
const onlyVisible = ref(false);

const filteredHeaders = computed(() => {
  if (onlyVisible.value) {
    return props.visibleHeaders.filter(header =>
      header.value.toLowerCase().includes(filter.value.toLowerCase()),
    );
  }
  return props.headers.filter(header =>
    header.value.toLowerCase().includes(filter.value.toLowerCase()),
  );
});
</script>

<template>
  <!-- NOTE: Using activator now for v-menu.
    Using the #id based implementation broke BaseDataTableHeaderMenu when switching between tabs.
    Right now the button does not appear immediately when page is loading.
    This is something to do with transitions. https://github.com/vuetifyjs/vuetify/issues/10578
  -->
  <div
    transition="slide-y-transition"
    :offset="10"
    position="bottom"
    z-index="4"
    :close-on-content-click="false"
  >
    <button
      variant="text"
      :icon="mdiTableCog"
    />
    <span>{{ $t("table.tooltipConfig") }}</span>
    <div>
      <ul flat>
        <div class="px-2 montserrat align-center">
          {{ $t("common.headers") }}
          <button
            :icon="mdiRefresh"
            variant="text"
            @click="emit('reset')"
          />
          {{ $t("table.tooltipResetHeaders") }}

          <button
            variant="text"
            :icon="!onlyVisible ? mdiEye : mdiEyeOff"
            @click="onlyVisible = !onlyVisible"
          />
          <span v-if="!onlyVisible">
            {{ $t("table.tooltipShowActiveHeaders") }}
          </span>
          <span v-else>{{ $t("table.tooltipShowAllHeaders") }}</span>
          <input
            v-model="filter"
            class="py-2"
            density="compact"
            variant="underlined"
            hide-details
            :label="$t('common.filter')"
          >
        </div>
        <VVirtualScroll
          :items="filteredHeaders"
          :height="500"
          :item-height="35"
          :width="300"
        >
          <template #default="{ item }">
            <li
              density="compact"
              variant="text"
              slim
              :disabled="sortBy.some((sortItem) => sortItem.key === item.value)"
              @click.prevent="emit('change', item)"
            >
              <div start class="mr-2">
                <VCheckboxBtn
                  density="compact"
                  :disabled="sortBy.some((sortItem) => sortItem.key === item.value)"
                  :model-value="item.show"
                  color="accent"
                />
              </div>
              <div>{{ item.title }}</div>
            </li>
            {{ $t("common.headerSelectDisabled") }}
          </template>
        </VVirtualScroll>
      </ul>
    </div>
  </div>
</template>
