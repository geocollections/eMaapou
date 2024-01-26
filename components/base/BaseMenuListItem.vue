<template>
  <v-hover v-slot="{ hover }">
    <v-list-item color="red" class="rounded" v-bind="$attrs">
      <v-list-item-title class="d-flex py-1">
        <div v-if="!labelOnly">
          <v-icon v-if="icon" :icon="icon" start />
          <v-icon v-else style="height: 24px; width: 24px" left />
        </div>
        <span class="align-self-center montserrat">{{ label }}</span>
        <v-icon
          v-show="hover && !labelOnly"
          :icon="trailingIcon"
          class="ml-auto"
        />
      </v-list-item-title>
    </v-list-item>
  </v-hover>
</template>

<script setup lang="ts">
import { mdiArrowRight } from "@mdi/js";
defineProps({
  icon: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    required: true,
  },
  labelOnly: {
    type: Boolean,
    default: false,
  },
  trailingIcon: {
    type: String,
    default: mdiArrowRight,
  },
});
</script>

<style lang="scss" scoped>
.v-list-item::before {
  border-radius: 4px;
}
</style>
