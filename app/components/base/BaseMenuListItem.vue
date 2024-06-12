<script setup lang="ts">
import { mdiArrowRight } from "@mdi/js";

withDefaults(defineProps<{
  label: string;
  icon?: string;
  labelOnly?: boolean;
  trailingIcon?: string;
}>(), {
  labelOnly: false,
  trailingIcon: mdiArrowRight,
});
</script>

<template>
  <VHover v-slot="{ isHovering, props }">
    <VListItem

      color="accent"
      base-color="grey-darken-3"
      class="rounded"
      v-bind="{ ...$attrs, ...props }"
    >
      <VListItemTitle class="d-flex py-1">
        <div v-if="!labelOnly">
          <VIcon
            v-if="icon"
            :icon="icon"
            start
          />
          <VIcon
            v-else
            style="height: 24px; width: 24px"
            start
          />
        </div>
        <span class="align-self-center montserrat">{{ label }}</span>
        <VIcon
          v-show="isHovering && !labelOnly"
          :icon="mdiArrowRight"
          class="ml-auto"
        />
      </VListItemTitle>
    </VListItem>
  </VHover>
</template>

<style lang="scss" scoped>
.v-list-item::before {
  border-radius: 4px;
}
</style>
