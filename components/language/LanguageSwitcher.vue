<script setup lang="ts">
import { mdiChevronDown, mdiWeb } from "@mdi/js";

defineProps({
  color: {
    type: String,
    default: "white",
  },
});
</script>

<template>
  <v-btn
    id="lang_switch_btn"
    aria-label="select language"
    variant="text"
    class="montserrat text-capitalize"
    :color="color"
  >
    <v-icon
      :icon="mdiWeb"
      start
      color="accent-lighten-2"
    />
    {{ $i18n.localeProperties.name }}
    <v-icon
      :icon="mdiChevronDown"
      end
      color="accent-lighten-2"
    />
    <v-menu
      activator="#lang_switch_btn"
      content-class="elevation-2 mt-1"
      transition="slide-y-transition"
      offset-y
      location="bottom right"
    >
      <language-list />
    </v-menu>
  </v-btn>
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
