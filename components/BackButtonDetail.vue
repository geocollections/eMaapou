<script setup lang="ts">
import { mdiSubdirectoryArrowLeft } from "@mdi/js";

const route = useRoute();
const localePath = useLocalePath();
const table = computed(() => {
  let res = route.name?.substring(0, route.name?.indexOf("-"));
  if (res === "file")
    res = "photo";

  return res;
});
</script>

<template>
  <VBtn
    id="back-btn-detail"
    icon
    variant="text"
    :to="localePath({ name: table })"
  >
    <VIcon style="transform: rotate(90deg)">
      {{ mdiSubdirectoryArrowLeft }}
    </VIcon>
    <VTooltip location="bottom" activator="#back-btn-detail">
      <span>{{ $t("common.goBack") }}</span>
    </VTooltip>
  </VBtn>
</template>
