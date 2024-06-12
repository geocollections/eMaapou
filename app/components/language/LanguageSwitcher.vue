<script setup lang="ts">
import { mdiChevronDown, mdiWeb } from "@mdi/js";

withDefaults(defineProps<{ color: string }>(), { color: "white" });
</script>

<template>
  <VBtn
    id="lang_switch_btn"
    aria-label="select language"
    variant="text"
    class="montserrat text-capitalize"
    :color="color"
  >
    <VIcon
      :icon="mdiWeb"
      start
      color="accent"
    />
    {{ $i18n.localeProperties.name }}
    <VIcon
      :icon="mdiChevronDown"
      end
      color="accent"
    />
    <VMenu
      activator="#lang_switch_btn"
      content-class="elevation-2 mt-1"
      transition="slide-y-transition"
      offset-y
      location="bottom right"
    >
      <LanguageList />
    </VMenu>
  </VBtn>
</template>

<style scoped lang="scss">
.lang-icon {
  height: 24px;
  width: 24px !important;
}

.flag {
  position: relative;
  display: inline-block;
  width: 1em;
  line-height: 1em;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  border-radius: 100%;
}

.flag:before {
  content: "\A0";
}
</style>
