<template>
  <v-btn
    id="back-btn-detail"
    icon
    variant="text"
    :to="localePath({ name: table })"
  >
    <v-icon style="transform: rotate(90deg)">
      {{ mdiSubdirectoryArrowLeft }}
    </v-icon>
    <v-tooltip location="bottom" activator="#back-btn-detail">
      <span>{{ $t("common.goBack") }}</span>
    </v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { mdiSubdirectoryArrowLeft } from "@mdi/js";

const route = useRoute();
const localePath = useLocalePath();
const table = computed(() => {
  let res = route.name?.substring(0, route.name?.indexOf("-"));
  if (res === "file") res = "photo";

  return res;
});
</script>
