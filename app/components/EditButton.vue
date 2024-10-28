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
  <VBtn
    size="small"
    variant="text"
    color="deep-orange-darken-2"
    icon
    :aria-label="$t('common.linkToEdit')"
    @click="handleClick"
  >
    <VIcon>{{ mdiSquareEditOutline }}</VIcon>
    <ClientOnly>
      <VTooltip
        location="bottom"
        activator="parent"
        :aria-label="$t('common.linkToEdit')"
      >
        <span>{{ $t("common.linkToEdit") }}</span>
      </VTooltip>
    </ClientOnly>
  </VBtn>
</template>
