<script>
import { mdiChevronDown } from "@mdi/js";

export default {
  name: "AppBarMenu",
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  computed: {
    icons() {
      return {
        mdiChevronDown,
      };
    },
  },
};
</script>

<template>
  <span>
    <VBtn
      :id="id"
      variant="text"
      class="montserrat"
      style="text-transform: capitalize; font-size: 0.875rem"
    >
      {{ label }}
      <VIcon class="ml-1">{{ icons.mdiChevronDown }}</VIcon>
      <VMenu
        :activator="`#${id}`"
        content-class="elevation-2 mt-1"
        transition="slide-y-transition"
        offset-y
        location="bottom right"

        attach=""
      >
        <slot />
      </VMenu>
    </VBtn>
  </span>
</template>
