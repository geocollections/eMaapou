<script setup lang="ts">
import { mdiChevronUp } from "@mdi/js";

const showFab = ref(false);
const goTo = useGoTo();

function onScroll(event: any) {
  if (typeof window === "undefined")
    return;
  const top = window.scrollY || event.target.scrollTop || 0;

  showFab.value = top > 400;
}

function toTop() {
  goTo(0);
}
</script>

<template>
  <button
    v-show="showFab"
    v-scroll="onScroll"
    position="fixed"
    class="mb-2 mr-2"
    location="bottom right"
    icon
    color="accent"
    @click="toTop"
  >
    <div>{{ mdiChevronUp }}</div>
  </button>
</template>
