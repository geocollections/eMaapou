<script setup lang="ts">
import { mdiCheckBold, mdiCloseThick } from "@mdi/js";

defineProps<{ modelValue: boolean }>();
</script>

<template>
  <VIcon :color="modelValue ? 'green' : 'red'" size="small">
    {{ modelValue ? mdiCheckBold : mdiCloseThick }}
  </VIcon>
</template>
