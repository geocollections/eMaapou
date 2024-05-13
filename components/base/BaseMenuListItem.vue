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
