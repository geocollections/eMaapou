<script setup lang="ts">
import { mdiChevronDown, mdiWeb } from "@mdi/js";

withDefaults(defineProps<{ color: string }>(), { color: "white" });
</script>

<template>
  <button
    id="lang_switch_btn"
    :aria-label="$t('languagesLabel')"
    variant="text"
    class="montserrat text-capitalize"
    :color="color"
  >
    <div
      :icon="mdiWeb"
      start
      color="accent"
    />
    {{ $i18n.localeProperties.name }}
    <div
      :icon="mdiChevronDown"
      end
      color="accent"
    />
    <div
      activator="#lang_switch_btn"
      content-class="elevation-2 mt-1"
      transition="slide-y-transition"
      offset-y
      location="bottom right"
    >
      <LanguageList />
    </div>
  </button>
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
