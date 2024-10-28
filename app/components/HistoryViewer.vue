<script setup lang="ts">
import { mdiArrowLeft } from "@mdi/js";
import { useDisplay } from "vuetify";

const display = useDisplay();
const localePath = useLocalePath();
const historyEntries = ref<any[]>([]);
const linkWidth = computed(() => {
  if (display.lgAndUp.value)
    return 200;
  return 100;
});
</script>

<template>
  <div v-if="historyEntries.length > 0" class="d-flex align-center">
    <VSubheader style="height: 32px !important" class="pl-0 text-no-wrap">
      {{ `${$t("common.history")}:` }}
    </VSubheader>
    <span class="pb-1 pt-2 history-viewer d-flex">
      <span
        v-for="(entry, index) in historyEntries"
        :key="index"
        class="d-flex align-center"
      >
        <NuxtLink
          class="text-link-grey history-link d-inline-block text-truncate"
          :style="`max-width: ${linkWidth}px`"
          :to="localePath({ path: entry.to })"
        >
          {{ entry.title }}
          <VTooltip
            open-delay="500"
            location="bottom"
            activator="parent"
          >
            <span>{{ entry.title }}</span>
          </VTooltip>
        </NuxtLink>
        <VIcon
          v-if="index !== historyEntries.length - 1"
          class="mx-1 divider"
          size="x-small"
        >
          {{ mdiArrowLeft }}
        </VIcon>
      </span>
    </span>
  </div>
</template>

<style scoped>
.history-viewer {
  white-space: nowrap;
  overflow-x: auto;
}

.history-viewer::-webkit-scrollbar {
  background: transparent;
  height: 4px;
}

.history-viewer::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.33);
  border-radius: 10px;
}

.history-viewer::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.66);
}

.history-link {
  font-size: 0.8em;
}

.divider {
  color: rgba(0, 0, 0, 0.38);
  font-size: 14px;
  vertical-align: top;
}
</style>
