<script setup lang="ts">
import { mdiSquareEditOutline } from "@mdi/js";

const { $openEdit } = useNuxtApp();
const route = useRoute();

const module = computed(() => {
  return route.name?.substring(0, route.name.indexOf("-")) ?? "";
});

function handleClick() {
  let editModule = module.value;
  if (module.value === "photo" || module.value === "file")
    editModule = "attachment";
  $openEdit(editModule, route.params.id as string);
}
</script>

<template>
  <v-btn
    id="edit-btn"
    :icon="mdiSquareEditOutline"
    size="small"
    variant="text"
    color="deep-orange-darken-2"
    @click="handleClick"
  />
  <v-tooltip location="bottom" activator="#edit-btn">
    <span>{{ $t("common.linkToEdit") }}</span>
  </v-tooltip>
</template>
