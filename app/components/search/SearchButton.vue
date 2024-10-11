<script setup lang="ts">
import { mdiMagnify } from "@mdi/js";
</script>

<template>
  <button
    type="submit"
    color="blue-darken-1"
    variant="flat"
    class="px-3 text-capitalize"
  >
    <VIcon start>
      {{ mdiMagnify }}
    </VIcon>
    <div class="montserrat">
      {{ $t('common.searchCommand') }}
    </div>
  </button>
</template>
