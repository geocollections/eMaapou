<script setup lang="ts">
import { mdiSquareEditOutline } from "@mdi/js";

type EditModules =
  "analysis" |
  "area" |
  "attachment" |
  "collection" |
  "dataset" |
  "drillcore" |
  "drillcore_box" |
  "locality" |
  "preparation" |
  "sample" |
  "site" |
  "specimen" |
  "stratigraphy";

const props = defineProps<{ module: EditModules; id: string }>();

const { $openEdit } = useNuxtApp();

function handleClick() {
  $openEdit(props.module, props.id);
}
</script>

<template>
  <button
    id="edit-btn"
    size="small"
    variant="text"
    color="deep-orange-darken-2"
    :icon="mdiSquareEditOutline"
    :aria-label="$t('common.linkToEdit')"
    @click="handleClick"
  />
  <VTooltip
    location="bottom"
    activator="#edit-btn"
    :aria-label="$t('common.linkToEdit')"
  >
    <span>{{ $t("common.linkToEdit") }}</span>
  </VTooltip>
</template>
